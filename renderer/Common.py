from datetime import date, datetime
import time, string, random, os, sys
from Logger import log_from_renderer
from I18n import *
import Renders
import json
import pika
import glob
from fieldy import Encoder, SchemaManager

def id_gen(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

render_map = {}
def refresh_render_map():
    for filename in glob.glob('Templates/*.json'):
        with open(filename) as json_file:
            data = json.load(json_file)
            render_map[data['name']] = data

def render_from_cv_dict(req):
    refresh_render_map()
    ret = ""

    log_from_renderer(req["curriculum_vitae"]["header"]["email"], req["path"], "GENERATING_CV_AST")

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

    if 'header' not in req_cv:
        log_from_renderer('', cv.cv_hash, "MISSING_HEADER")
        raise Exception('Header is missing')

    sm = SchemaManager('./Models/')
    sm.load('Cv')
    enc = Encoder(sm)
    cv = enc.to_object(req_cv, 'Cv')

    log_from_renderer(cv.header.email, cv.cv_hash, "CV_AST_GENERATED")

    baseFolder = render_map[render_key]['base_folder']

    if 'lang' not in params:
      params['lang'] = 'en_US'
      
    resources = get_resources(params['lang'][:2])

    path = Renders.CvRenderTexToPdf.render(cv, path=path, cvRender=Renders.CvRenderCheetahTemplate, baseFolder=baseFolder, command=render_map[render_key]['command'], params=params, resources=resources)
    return path
