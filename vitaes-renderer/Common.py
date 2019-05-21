from datetime import date, datetime
import time, string, random, os, sys
from flask import Flask, request, abort, send_file
from bson.objectid import ObjectId
from CurriculumVitae import CurriculumVitae
from Logger import log_from_renderer
from I18n import *
import Renders
import json
import timestring
from flask_cors import CORS
import pika
import gridfs
import pymongo 
from fieldy import Encoder, SchemaManager

def id_gen(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

render_map = {}
def refresh_render_map():
    db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes
    client = db.template_info
    for model in client.find():
        data = model.copy()
        del data['_id']
        render_map[data['name']] = data

def render_from_cv_dict(req):
    refresh_render_map()
    cv = CurriculumVitae(req["path"])
    ret = ""

    log_from_renderer(req["curriculum_vitae"]["CvHeaderItem"]["email"], cv.cv_hash, "GENERATING_CV_AST")

    path = None
    if 'path' in req:
        path = req['path']
    params = {}
    render_key = "awesome"
    params['section_order'] = ['work', 'education', 'achievement', 'project', 'academic', 'language', 'skill']
    req_cv = req['curriculum_vitae']
    if 'render_key' in req:
        render_key = req['render_key']
    params = render_map[render_key]['fixed_params']
    if 'params' in req:
        params.update(req['params'])
    if 'section_order' in req:
        params['section_order'] = req['section_order']

    if 'CvHeaderItem' not in req_cv:
        log_from_renderer(req["curriculum_vitae"]["CvHeaderItem"]["email"], cv.cv_hash, "MISSING_HEADER")
        abort(400, "Missing header")

    sm = SchemaManager('./Models/')
    enc = Encoder(sm)
    for cv_key in req_cv.keys():
        req_key = req_cv[cv_key]

        items = []
        sm.load(cv_key)
        if cv_key == 'CvHeaderItem':
            items.append(req_key)
        else:
            items = req_key

        for item in items:
            cv_item = enc.to_object(item, cv_key)
            cv.add(cv_item, cv_key)

    log_from_renderer(cv.header.email, cv.cv_hash, "CV_AST_GENERATED")

    baseFolder = render_map[render_key]['base_folder']
    if baseFolder.startswith("mongo://"):
        db = pymongo.MongoClient('mongodb://root:vitaes@mongo', 27017).vitaes
        gfs = gridfs.GridFS(db)
        mongoId = baseFolder[8:]
        baseFolder = path
        os.system("mkdir Templates/" + path)
        zip_gout = gfs.find({"_id": ObjectId(mongoId)})
        zip_file = zip_gout[0]
        for zip_f in zip_gout:
            if zip_f._id.__str__() == mongoId:
                zip_file = zip_f
        zip_file = zip_file.read()
        os.system("touch Templates/" + path + "/main.zip")
        file = open("Templates/" + path + "/main.zip", "wb")
        file.write(zip_file)
        file.close()
        os.system("unzip Templates/" + path + "/main.zip -d Templates/" + path)

    if 'lang' not in params:
      params['lang'] = 'en_US'
      
    resources = get_resources(params['lang'][:2])

    path = Renders.CvRenderTexToPdf.render(cv, path=path, cvRender=Renders.CvRenderCheetahTemplate, baseFolder=baseFolder, command=render_map[render_key]['command'], params=params, resources=resources)
    return path
