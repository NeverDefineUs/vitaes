FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip 
RUN apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
RUN apt-get install -y texlive-xetex texlive-math-extra
RUN mkdir exec
WORKDIR /exec
COPY requirements.txt . 
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD python3 Server.py
