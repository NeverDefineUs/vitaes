FROM golang:1.12-alpine AS build-env
RUN apk update && apk upgrade && apk add --no-cache \
    git \
    build-base
ENV GOPATH=/
ENV GO111MODULE=on
WORKDIR /project/
COPY go.mod .
RUN go mod download
COPY . .
RUN go get -d -v ./...
RUN go build -o app

FROM alpine
WORKDIR /
COPY --from=build-env /project/app /
ENTRYPOINT ./app