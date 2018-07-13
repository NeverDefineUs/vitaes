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
    if 'header' in req_cv.keys():
        req_header = req_cv['header']
        header = CvHeaderItem(
            name = req_header['name'],
            email = get_field_or_none(req_header, "email"),
            github = get_field_or_none(req_header, "github"),
            linkedin = get_field_or_none(req_header, "linkedin"),
            phone = get_field_or_none(req_header, "phone"),
            address = get_field_or_none(req_header, "address"),
            birthday =  get_date_field_or_none(req_header, "birthday")
        )
        cv.add(header)
    if 'languages' in req_cv.keys():
        for req_language in req_cv['languages']:
            language = CvLanguageItem(
                language = get_field_or_none(req_language, 'language'),
                level = get_field_or_none(req_language, 'level'),
            )
            cv.add(language)
    if 'work_experience' in req_cv.keys():
        for req_experience in req_cv['work_experience']:
            
            cv.add(req_experience)
    print(cv.__str__())
    return ""