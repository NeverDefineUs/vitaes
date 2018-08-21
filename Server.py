from datetime import date, datetime
from flask import Flask, request, abort
from CurriculumVitae import CurriculumVitae
from Models import *

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

@app.route('/CV/', methods=['POST'])
def process_curr():
    cv = CurriculumVitae()
    req = request.json
    ret = ""

    if 'curriculum_vitae' in req.keys():
        req_cv = req['curriculum_vitae']
    else:
        abort(503)

    for cv_key in req_cv.keys():
        req_key = req_cv[cv_key]

        gen_cv_item = '('
        for key, value in req_key.items():
            gen_cv_item = gen_cv_item + "{key}='{value}',".format(key=key, value=value)
        gen_cv_item = gen_cv_item + ')'

        cv_item = eval(cv_key + gen_cv_item)
        cv.add(cv_item)

    print(cv.__str__())

    return ""