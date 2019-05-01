FROM golang:1.12-alpine AS build-env
RUN apk update && apk upgrade && apk add git build-base
ENV GOPATH=/
ENV GO111MODULE=on
WORKDIR /src/github.com/neverdefineus/vitaes/vitaes-logger/
COPY go.mod .
RUN go mod download
COPY . .
RUN go get -d -v ./...
RUN go build -o app

FROM alpine
WORKDIR /
COPY --from=build-env /src/github.com/neverdefineus/vitaes/vitaes-logger/app /
EXPOSE 8017
ENTRYPOINT ./app