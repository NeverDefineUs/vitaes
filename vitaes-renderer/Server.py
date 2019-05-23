from datetime import date, datetime
import time, sys
from flask import Flask, request, abort, send_file
import json
from flask_cors import CORS
from Common import render_map, render_from_cv_dict, refresh_render_map
from Logger import log_from_server
import pika
import gridfs
import pymongo 
import redis

app = Flask(__name__)
CORS(app)
db = redis.Redis(host='redis')
time.sleep(10)

@app.route('/template/', methods=['GET'])
def get_cv_types():
    refresh_render_map()
    response = app.response_class(
        response=json.dumps(render_map),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/cv/', methods=['POST'])
def process_curr_delayed():
    req = request.json
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='cv_requests')
    channel.basic_publish(exchange='',routing_key='cv_requests', body=json.dumps(req))
    log_from_server(req["curriculum_vitae"]["CvHeaderItem"]["email"], req["path"], "SENT_TO_RABBITMQ")
    return req['path']


@app.route('/cv/<cvid>/', methods=['GET'])
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
