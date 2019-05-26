import requests

def log_from_renderer(email, cv_hash, step, log_data=''):
    log(email, cv_hash, 'RENDERER', step, log_data)

def log_from_api(email, cv_hash, step, log_data=''):
    log(email, cv_hash, 'API', step, log_data)

def log(email, cv_hash, origin, step, log_data):
    try:
        requests.post('http://logger:6000/', data = {
            'email': email,
            'cv_hash': cv_hash,
            'origin': origin,
            'step': step,
            'data': log_data,
        })
    except:
        pass