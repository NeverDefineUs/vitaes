from datetime import date, datetime
import time
import json, sys, hashlib
from Common import render_map, render_from_cv_dict
from Logger import log_from_renderer
import pika
import redis
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
    client = InfluxDBClient(host='tsdb', port=8086, username='root', password='root')
    try:
      try:
        client.create_database('logs')
      except:
        print('tsdb already created')
      client.switch_database('logs')
      break
    except:
      print('retry')

db = redis.Redis(host='redis')

def get_cv_queue(ch, method, properties, body):
    mes = ""
    ts = time.time() 
    email = ""
    cv_type = ""
    lang = ""
    try:
        body=body.decode('utf-8')
        dic = json.loads(body)
        cv_type = dic["render_key"]
        email = dic["curriculum_vitae"]["CvHeaderItem"]["email"]
        log_from_renderer(email, dic["path"], "CONSUMED_FROM_RABBITMQ")
        lang = dic["params"]["lang"]
        ans = render_from_cv_dict(dic)
        file = open('Output/' + ans + '.pdf', 'rb')
        ansb = file.read()
        file.close()
        log_from_renderer(email, dic["path"], "STORING_IN_REDIS")
        db.set(name=ans, value=ansb, ex=600)
        mes = "OK"
    except:
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

channel.basic_consume(queue='cv_requests',
                      on_message_callback=get_cv_queue,
                      auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
while True:
    time.sleep(60)
    print('I am alive')