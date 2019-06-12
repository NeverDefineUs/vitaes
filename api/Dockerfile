FROM golang:1.12-alpine AS build-env
RUN apk update && apk upgrade && apk add --no-cache \
    git \
    build-base
ENV GOPATH=/
ENV GO111MODULE=on
WORKDIR /vitaes
COPY Gopkg.lock .
COPY Gopkg.toml .
COPY vendor .
RUN dep ensure
COPY . .
RUN go get -d -v ./...
RUN go build -o app

FROM alpine
WORKDIR /vitaes
COPY --from=build-env /vitaes/app /vitaes
RUN mkdir templates
COPY templates templates/
ENTRYPOINT ./app
