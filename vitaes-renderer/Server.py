from datetime import date, datetime
import time, sys
from flask import Flask, request, abort, send_file
import json
from flask_cors import CORS
from Common import render_map, render_from_cv_dict, refresh_render_map
from Logger import log_server
import pika
import gridfs
import pymongo 
import redis

app = Flask(__name__)
CORS(app)
db = redis.Redis(host='redis')
time.sleep(10)

@app.route('/template/', methods=['GET', 'POST'])
def get_cv_types():
    if request.method == 'GET':
        refresh_render_map()
        response = app.response_class(
            response=json.dumps(render_map),
            status=200,
            mimetype='application/json'
        )
        return response
    elif request.method == 'POST':
        template = request.json
        db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes.template_info
        for field in ['name', 'command', 'params', 'fixed_params', 'owner']:
            if field not in template:
                abort(403, "Missing field: " + field)
        templates = db.find({"name":template['name']})
        if templates.count() != 0:
            abort(403, "Cant push to existing file")
        db.insert_one(template)
        return "ok"

@app.route('/template/files/<templatename>/', methods=['POST'])
def add_file_req(templatename):
    if 'file' not in request.files:
        abort(403, 'No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        abort(403, 'No selected file')
        return redirect(request.url)
    if file and len(file.filename) > 4 and file.filename[-4:] == ".zip":
        db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes
        templates = db.template_info.find({"name":templatename})
        if templates.count() == 0:
            abort(404, "Template name not found")
        template = templates[0]
        if "base_folder" in template and template['base_folder'][0:6] != "mongo:":
            abort(403, "This template already have a file")
        gfs = gridfs.GridFS(db)
        fl = gfs.put(file, filename=templatename + ".zip")
        template["base_folder"] = "mongo://" + fl.__str__()
        db.template_info.save(template)
        return "ok"
    abort(404, "No file in submission")

@app.route('/template/like/', methods=['POST'])
def like_template():
    req = request.json
    if 'uid' not in req:
        abort(403, 'No user in submission')
    if 'templatename' not in req:
        abort(403, 'No Template name in submission')
    templatename = req['templatename']
    db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes
    user_db = db.user
    template_db = db.template_info
    template = template_db.find_one({'name': templatename})
    if template is None:
        abort(404, "template not found")
    user = user_db.find_one({'uid': req['uid']})
    if user is None:
        user_db.insert_one({'uid': req['uid'], 'likes': []})
        user = user_db.find_one({'uid': req['uid']})
    if templatename in user['likes']:
      user['likes'].remove(templatename)
      user_db.save(user)
      template['data']['likes'] -= 1
      template_db.save(template)
      return 'ok'
    else:
      user['likes'].append(templatename)
      user_db.save(user)
      template['data']['likes'] += 1
      template_db.save(template)
      return 'ok'

@app.route('/cv/', methods=['POST'])
def process_curr_delayed():
    req = request.json
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='cv_requests')
    channel.basic_publish(exchange='',routing_key='cv_requests', body=json.dumps(req))
    log_server(req["curriculum_vitae"]["CvHeaderItem"]["email"], req["path"], "SENT_TO_RABBITMQ")
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
