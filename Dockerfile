FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip texlive-full
RUN mkdir project
WORKDIR exec
COPY requirements.txt . 
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD python3 Server.py
