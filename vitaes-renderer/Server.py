from datetime import date, datetime
import time
from flask import Flask, request, abort, send_file
import json
from flask_cors import CORS
from Common import render_map, render_from_cv_dict, id_gen
import pika
import redis

app = Flask(__name__)
CORS(app)
db = redis.Redis(host='redis')
time.sleep(10)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='cv_requests')

@app.route('/CVTYPES/', methods=['GET'])
def get_cv_types():
    response = app.response_class(
        response=json.dumps(list(render_map.keys())),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/CV/', methods=['POST'])
def process_curr():
    req = request.json
    return send_file("Output/" + render_from_cv_dict(req) + ".pdf")


@app.route('/CVQUEUE/', methods=['POST'])
def process_curr_delayed():
    req = request.json
    req['path'] = id_gen(size=10)
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
