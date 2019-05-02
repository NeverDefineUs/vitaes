FROM node:11.14-slim as react-build
WORKDIR /project
RUN yarn global add serve
COPY package.json yarn.lock ./
RUN yarn
COPY . .
