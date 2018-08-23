from datetime import date, datetime
from flask import Flask, request, abort, send_file
from CurriculumVitae import CurriculumVitae
from Models import *
import Renders
import json
import timestring

def parse_date(str):
    print(str)
    return timestring.Date(str).date

app = Flask(__name__)

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

@app.route('/CV/', methods=['POST'])
def process_curr():
    cv = CurriculumVitae()
    req = request.json
    ret = ""

    req_cv = req
    if 'curriculum_vitae' in req.keys():
        req_cv = req['curriculum_vitae']

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

    path = Renders.CvRenderTexToPdf.render(cv)

    return send_file("Output/" + path + ".pdf")

if __name__ == "__main__":
    app.run()