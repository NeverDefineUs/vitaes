FROM node:11.14-alpine as react-build
WORKDIR /vitaes
COPY package.json jsconfig.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=react-build /vitaes/build/ /usr/share/nginx/html
