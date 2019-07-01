from datetime import date, datetime
import time
import json, sys, hashlib
from Common import render_map, render_from_cv_dict
from Logger import log_step
import pika
import requests
import traceback
from influxdb import InfluxDBClient

tries = 0
connection = None
channel = None
while tries < 10:
    time.sleep(10)
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='cv_requests')
        break
    except:
        tries += 1

while tries < 10:
    time.sleep(10)
    tries += 1
    client = InfluxDBClient(host='influxdb', port=8086, username='root', password='root')
    try:
      try:
        client.create_database('logs')
      except:
        print('influxdb already created')
      client.switch_database('logs')
      break
    except:
      print('retry')

def get_cv_queue(ch, method, properties, body):
    mes = ""
    ts = time.time() 
    email = ""
    cv_type = ""
    lang = ""
    try:
        body=body.decode('utf-8')
        dic = json.loads(body)
        print('[*] Consuming job: '+dic["path"], flush=True)
        cv_type = dic["render_key"]
        email = dic["curriculum_vitae"]["header"]["email"]
        log_step(email, dic["path"], "CONSUMED_FROM_RABBITMQ")
        lang = dic["params"]["lang"]
        ans = render_from_cv_dict(dic)
        file = open('Output/' + ans + '.pdf', 'rb')
        ansb = file.read()
        file.close()
        log_step(email, dic["path"], "SENDING_TO_STORAGE")
        requests.post('http://storage:6000/', data = {
            'email': email,
            'id': ans,
            'content': ansb
        })
        mes = "OK"
    except Exception:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        p_output = repr(traceback.format_exception(exc_type, exc_value, exc_traceback)) 
        log_step(email, dic["path"], "ERROR_REPORTED_IN_RENDERER", "", p_output)
        mes = "err"
    email_hash = hashlib.sha256()
    email_hash.update(str.encode(email))
    email = email_hash.hexdigest()
    log = [
      {
        "measurement": "accuracy",
        "fields": {
          "status": mes,
          "render_time": float(time.time() - ts),
          "model": cv_type,
          "email": email,
          "lang": lang,
        },
        "tags": {
          "status": mes,
          "render_time": float(time.time() - ts),
          "model": cv_type,
          "email": email,
          "lang": lang,
        },
      }
    ]
    client.write_points(log)
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_consume(queue='cv_requests',
                      on_message_callback=get_cv_queue)

print('[*] Waiting for messages. To exit press CTRL+C', flush=True)
channel.start_consuming()