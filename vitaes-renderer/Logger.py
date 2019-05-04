import requests

def renderer_logger(email, cv_hash, step, log_data=''):
    logger(email, cv_hash, 'RENDERER', step, log_data)

def server_logger(email, cv_hash, step, log_data=''):
    logger(email, cv_hash, 'SERVER', step, log_data)

def logger(email, cv_hash, origin, step, log_data):
    requests.post('http://logger:8017/', data = {
        'email': email,
        'cv_hash': cv_hash,
        'origin': origin,
        'step': step,
        'data': log_data,
    })