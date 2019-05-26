import requests

def log_from_renderer(email, cv_hash, step, log_data='', stacktrace=''):
    log(email, cv_hash, 'RENDERER', step, log_data, stacktrace)

def log_from_api(email, cv_hash, step, log_data='', stacktrace=''):
    log(email, cv_hash, 'API', step, log_data, stacktrace)

def log(email, cv_hash, origin, step, log_data, stacktrace):
    try:
        requests.post('http://logger:6000/', data = {
            'email': email,
            'cv_hash': cv_hash,
            'origin': origin,
            'step': step,
            'data': log_data,
            'stacktrace': stacktrace,
        })
    except:
        pass