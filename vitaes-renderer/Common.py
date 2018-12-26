from datetime import date, datetime
import time, string, random, os, sys
from flask import Flask, request, abort, send_file
from bson.objectid import ObjectId
from CurriculumVitae import CurriculumVitae
from Models import *
import Renders
import json
import timestring
from flask_cors import CORS
import pika
import gridfs
import pymongo 

def id_gen(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def parse_date(str):
    return timestring.Date(str).date

def get_field_or_none(req, field_name):
    if field_name in req.keys():
        return req[field_name]
    return None

def get_date_field_or_none(req, field_name):
    field = get_field_or_none(req, field_name)
    if field is None:
        return None
    return datetime.strptime(field, '%Y-%m-%d').date()

def get_parse_string(cv_key, item):
    gen_cv_item = cv_key + '('

    for key, value in item.items():
        gen_cv_item = gen_cv_item + "{0}=".format(key)
        if type(value) is dict:
            for in_key, in_value in value.items():
                inside_item = get_parse_string(in_key, in_value)
                gen_cv_item = gen_cv_item + "{0},".format(inside_item)
                break
        elif key[-4:] == "date":
            gen_cv_item = gen_cv_item + "parse_date('{0}'),".format(value)
        elif type(value) is str:
            gen_cv_item = gen_cv_item + "\"\"\"{0}\"\"\",".format(value.replace("\"","\\\""))
        else:
            gen_cv_item = gen_cv_item + "'{0}',".format(value)

    gen_cv_item = gen_cv_item + ')'

    return gen_cv_item

def parse_item(cv_key, item):
    try:
        cv_item = eval(get_parse_string(cv_key, item))
    except TypeError as err:
        abort(400, err)

    return cv_item

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
    cv = CurriculumVitae()
    ret = ""

    req_cv = req
    path = None
    if 'path' in req:
        path = req['path']
    params = {}
    render_key = "awesome"
    params['section_order'] = ['work', 'education', 'achievement', 'project', 'academic', 'language', 'skill']
    if 'curriculum_vitae' in req:
        req_cv = req['curriculum_vitae']
        if 'render_key' in req:
            render_key = req['render_key']
        params = render_map[render_key]['fixed_params']
        if 'params' in req:
            params.update(req['params'])
        if 'section_order' in req:
            params['section_order'] = req['section_order']



    if 'CvHeaderItem' not in req_cv:
        abort(400, "Missing header")

    for cv_key in req_cv.keys():
        req_key = req_cv[cv_key]

        items = []

        if cv_key == 'CvHeaderItem':
            items.append(req_key)
        else:
            items = req_key

        for item in items:
            cv_item = parse_item(cv_key, item)
            cv.add(cv_item)
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

    path = Renders.CvRenderTexToPdf.render(cv, path=path, cvRender=Renders.CvRenderCheetahTemplate, baseFolder=baseFolder, command=render_map[render_key]['command'], params=params)
    return path
