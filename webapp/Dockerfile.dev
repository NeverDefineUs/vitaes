FROM node:11.14-slim
WORKDIR /vitaes
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD yarn start
