FROM node:11.14-alpine
WORKDIR /vitaes
COPY package.json tsconfig.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn", "start"]
