from datetime import date, datetime
from flask import Flask, request, abort, send_file
from CurriculumVitae import CurriculumVitae
from Models import *
import Renders
import json
import timestring
from flask_cors import CORS

def parse_date(str):
    print(str)
    return timestring.Date(str).date

app = Flask(__name__)
CORS(app)

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
render_map = {
    "modern_cv": lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, params={"scale": "0.75"}),
    "modern_cv_large": lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, params={"scale": "0.9"}),
    'awesome-emerald': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-emerald", "section_order": section_order}),
    'awesome-skyblue': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-skyblue", "section_order": section_order}),
    'awesome-red': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-red", "section_order": section_order}),
    'awesome-pink': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-pink", "section_order": section_order}),
    'awesome-orange': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-orange", "section_order": section_order}),
    'awesome-nephritis': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-nephritis", "section_order": section_order}),
    'awesome-concrete': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-concrete", "section_order": section_order}),
    'awesome-darknight': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="awesome", command="xelatex", params={"color": "awesome-darknight", "section_order": section_order}),
    'modern_cv_blue': lambda cv, section_order: Renders.CvRenderTexToPdf.render(cv, cvRender=Renders.CvRenderCheetahTemplate, baseFolder="cv_7", command="pdflatex", params={"color": "blue", "scale":"0.75", "section_order": section_order})
}

@app.route('/CV/', methods=['POST'])
def process_curr():
    cv = CurriculumVitae()
    req = request.json
    ret = ""

    print("REQUEST")

    req_cv = req

    render_key = "awesome-emerald"
    section_order = ['work', 'education', 'achievement', 'project', 'academic', 'language', 'skill']
    if 'curriculum_vitae' in req.keys():
        req_cv = req['curriculum_vitae']
        if 'render_key' in req.keys():
            render_key = req['render_key']
        if 'section_order' in req.keys():
            section_order = req['section_order']

    if 'CvHeaderItem' not in req_cv.keys():
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

    path = render_map[render_key](cv, section_order)

    return send_file("Output/" + path + ".pdf")

if __name__ == "__main__":
    app.run(host='0.0.0.0')