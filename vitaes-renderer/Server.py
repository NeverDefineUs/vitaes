from datetime import date, datetime
import time
from flask import Flask, request, abort, send_file
import json
from flask_cors import CORS
from Common import render_map, render_from_cv_dict, id_gen, refresh_render_map
import pika
import gridfs
import pymongo 
import redis

app = Flask(__name__)
CORS(app)
db = redis.Redis(host='redis')
time.sleep(10)

@app.route('/CVTYPES/', methods=['GET'])
def get_cv_types():
    refresh_render_map()
    response = app.response_class(
        response=json.dumps(render_map),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/ADDFILE/', methods=['POST'])
def add_file_req():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and len(file.filename) > 4 and file.filename[-4:] == ".zip":
        db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes
        gfs = gridfs.GridFS(db)
        fl = gfs.new_file()
        fl.write(file)
        fl.filename = file.filename
        fl.close()
        return "ok"
    abort(404, "Error")


@app.route('/CVQUEUE/', methods=['POST'])
def process_curr_delayed():
    req = request.json
    req['path'] = id_gen(size=10)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='cv_requests')
    channel.basic_publish(exchange='',routing_key='cv_requests', body=json.dumps(req))
    return req['path']


@app.route('/CVGET/<cvid>/', methods=['GET'])
def get_curr(cvid):
    cv = db.get(cvid)
    if cv != None:
        file = open('Output/cv_' + cvid + '.pdf', 'wb')
        file.write(cv)
        file.close()
        return send_file('Output/cv_' + cvid + '.pdf')
    else:
        abort(404, "Probably not ready")
    
if __name__ == "__main__":
    app.run(host='0.0.0.0')
