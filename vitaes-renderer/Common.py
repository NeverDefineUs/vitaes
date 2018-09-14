from datetime import date, datetime
import time, string, random, os
from flask import Flask, request, abort, send_file
from CurriculumVitae import CurriculumVitae
from Models import *
import Renders
import json
import timestring
from flask_cors import CORS
import pika

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
    for model in os.listdir("Templates/"):
        print(model)
        if model[-5:] == '.json':
            file = open('Templates/' + model, 'r')
            data = json.loads(file.read())
            file.close()
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

    path = Renders.CvRenderTexToPdf.render(cv, path=path, cvRender=Renders.CvRenderCheetahTemplate, baseFolder=render_map[render_key]['base_folder'], command=render_map[render_key]['command'], params=params)
    return path
