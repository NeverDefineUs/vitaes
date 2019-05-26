import requests

def log_step(email, cv_hash, step, log_data="", stacktrace=""):
    try:
        requests.post('http://logger:6000/', data = {
            'email': email,
            'cv_hash': cv_hash,
            'origin': 'RENDERER',
            'step': step,
            'data': log_data,
            'stacktrace': stacktrace,
        })
    except:
        pass