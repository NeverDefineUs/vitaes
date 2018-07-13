from flask import Flask, request, abort
from CurriculumVitae import CurriculumVitae
from Models import *

app = Flask(__name__)

def get_field_or_none(req, field_name):
    if field_name in req.keys():
        return req[field_name]
    return None

@app.route('/CV/', methods=['POST'])
def process_curr():
    cv = CurriculumVitae()
    req = request.json
    ret = ""
    if 'curriculum_vitae' in req.keys():
        req_cv = req['curriculum_vitae']
    else:
        abort(503)
    if 'header' in req_cv:
        req_header = req_cv['header']
        header = CvHeaderItem(
            name = req_header['name'],
            email = get_field_or_none(req_header, "email"),
            github = get_field_or_none(req_header, "github"),
            linkedin = get_field_or_none(req_header, "linkedin"),
            phone = get_field_or_none(req_header, "phone"),
            address = get_field_or_none(req_header, "address"),
        )
        cv.add(header)
    print(cv.__str__())
    return ""