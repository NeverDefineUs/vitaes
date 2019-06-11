#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    echo "Starting in $VITAES_ENV environment..."
    echo ""
    linkerd inject kubernetes/rabbit.yaml | kubectl apply -f -
    linkerd inject kubernetes/redis.yaml | kubectl apply -f -
    linkerd inject kubernetes/grafana.yaml | kubectl apply -f -
    linkerd inject kubernetes/logger.yaml | kubectl apply -f -
    linkerd inject kubernetes/webapp.yaml | kubectl apply -f -
    sleep 10
    linkerd inject kubernetes/renderer.yaml | kubectl apply -f -
    linkerd inject kubernetes/api.yaml | kubectl apply -f -
    linkerd inject kubernetes/storage.yaml | kubectl apply -f -
    linkerd inject kubernetes/ingress.yaml | kubectl apply -f -
    echo ""
    echo "Started in $VITAES_ENV environment"
else
    echo "Starting in development environment..."
    echo ""
    docker-compose up --build --detach
    echo ""
    echo "Started in development environment"
fi