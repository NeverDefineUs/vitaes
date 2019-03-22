FROM node:slim as react-build
WORKDIR /project
copy package.json yarn.lock ./
RUN yarn
COPY . .