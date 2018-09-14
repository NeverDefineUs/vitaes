from datetime import date, datetime
import time
import json, sys
from Common import render_map, render_from_cv_dict
import pika
import redis

time.sleep(10)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='cv_requests')

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
import pika
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='cv_requests')
channel.basic_publish(exchange='',routing_key='cv_requests', body='{"CvAcademicProjectItem":[{"description":"Gave lectures about Algorithms and Data Structures such as BFS, AVL trees to classrooms of over 50 students each semester","end_date":"2017-12-01","institution":{"CvInstitution":{"name":"UFPE"}},"name":"Algorithms Teacher Assistant","start_date":"2016-03-01"}],"CvAchievementItem":[{"competitors":816,"end_date":"2017-09-09","name":"3rd Place in ACM-ICPC Brazilian Regionals","place":"","start_date":"2017-09-09"},{"competitors":440,"end_date":"2017-11-11","name":"4th Place in ACM-ICPC South America Regionals","place":"","start_date":"2017-11-11"},{"competitors":140,"end_date":"2018-04-19","name":"104th Place in ACM-ICPC World Finals","place":"","start_date":"2018-04-19"},{"competitors":54,"end_date":"2017-04-05","name":"2nd Place at Microsoft College Coding Competition at UFPE","place":"","start_date":"2017-04-05"}],"CvEducationalExperienceItem":[{"course":"Computer Science BSc","end_date":"2019-07-01","institution":{"CvInstitution":{"name":"UFPE"}},"location":{"CvLocation":{"city":"Recife","country":"Brazil"}},"start_date":"2015-03-01"},{"course":"Unicamp ICPC Summer School","end_date":"2017-01-01","institution":{"CvInstitution":{"name":"Unicamp"}},"location":{"CvLocation":{"city":"Sao Paulo","country":"Brazil"}},"start_date":"2017-01-01"},{"course":"Encryption I","end_date":"2017-01-14","institution":{"CvInstitution":{"name":"Coursera, Stanford"}},"start_date":"2017-01-14"},{"course":"Machine Learning","end_date":"2016-12-20","institution":{"CvInstitution":{"name":"Coursera, Stanford"}},"start_date":"2016-12-20"},{"course":"Getting started with Augmented Reality","end_date":"2016-11-30","institution":{"CvInstitution":{"name":"Coursera, Mines-Telecom"}},"start_date":"2016-11-30"},{"course":"Fundamentals of Neuroscience I","end_date":"2014-09-24","institution":{"CvInstitution":{"name":"Edx, Harvard"}},"start_date":"2014-09-24"}],"CvHeaderItem":{"address":"Avenida Bernardo Vieira de Melo, 2087, Jaboatao dos guararapes, Brazil","email":"arthurlpgcosta@gmail.com","github":"github.com/Arthurlpgc","name":"Arthur Costa","phone":"+55 (81) 99429-3511"},"CvImplementationProjectItem":[{"end_date":"2016-11-01","language":"C++","name":"Quadrics and Bezier surfaces Raytracer","start_date":"2016-11-01"},{"end_date":"2016-05-01","language":"Java","name":"Music Sender and Player Java app(Client and Server)","start_date":"2016-05-01"},{"end_date":"2016-06-01","language":"Javascript","name":"Contributions on Codepit and Jason Park Algorithm visualizer","start_date":"2016-06-01"},{"description":"Created an open source tool for creating resumes for computer science students, works by creating a abstract tree from a json with the fields, and then generates the CV using any of the renders avaliable. Github: https://github.com/Arthurlpgc/CVCS","language":"Python","name":"CVCS","start_date":"2018-07-13"}],"CvLanguageItem":[{"language":"Portuguese","level":"Native"},{"language":"English","level":"Fluent"}],"CvWorkExperienceItem":[{"description":"Worked on the algorithms of wifi-based location and visit detection.","end_date":"2017-09-01","institution":{"CvInstitution":{"name":"Inloco"}},"location":{"CvLocation":{"city":"Recife","country":"Brazil"}},"role":"Junior Researcher","start_date":"2017-05-01"},{"description":"Worked on the windows accessibility tools.","end_date":"2018-03-02","institution":{"CvInstitution":{"name":"Microsoft"}},"location":{"CvLocation":{"city":"Seattle","country":"USA"}},"role":"Software Engineer Intern","start_date":"2017-12-11"},{"description":"Worked on the security of the internal network devices.","end_date":"2018-08-03","institution":{"CvInstitution":{"name":"Facebook"}},"location":{"CvLocation":{"city":"London","country":"United Kingdom"}},"role":"Software Engineer Intern","start_date":"2018-05-14"}]}')