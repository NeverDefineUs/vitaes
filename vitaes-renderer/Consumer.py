from datetime import date, datetime
import time
import json, sys
from Common import render_map, render_from_cv_dict
import pika
import redis
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

db = redis.Redis(host='redis')

def get_cv_queue(ch, method, properties, body):
    ans = None
    try:
        body=body.decode('utf-8')
        dic = json.loads(body)
        ans = render_from_cv_dict(dic)
        file = open('Output/' + ans + '.pdf', 'rb')
        ansb = file.read()
        file.close()
        db.set(name=ans, value=ansb, ex=600)
    except:
        print("Error on ", ans)

channel.basic_consume(get_cv_queue,
                      queue='cv_requests',
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
while True:
    time.sleep(60)
    print('I am alive')