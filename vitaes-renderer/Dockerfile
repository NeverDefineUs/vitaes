FROM vitaes/latexos
RUN mkdir exec
WORKDIR /exec
COPY requirements.txt . 
RUN pip3 install -r requirements.txt
COPY . . 
EXPOSE 5000
CMD python3 Server.py
