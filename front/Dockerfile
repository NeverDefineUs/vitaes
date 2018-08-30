FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN mkdir project
WORKDIR project
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD npm start
