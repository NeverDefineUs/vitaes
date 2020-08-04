FROM node:11.14-alpine
ENV GOOGLE_APPLICATION_CREDENTIALS="/vitaes/service-account-file.json"
WORKDIR /vitaes
COPY package.json tsconfig.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn", "start"]
