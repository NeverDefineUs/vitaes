FROM node:11.14-slim as react-build
WORKDIR /project
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=react-build /project/build/ /usr/share/nginx/html
