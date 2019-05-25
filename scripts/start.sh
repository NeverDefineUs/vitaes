#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    echo "Starting in $VITAES_ENV environment..."
    echo ""
    kubectl apply --recursive -f kubernetes/rabbit.yaml
    kubectl apply --recursive -f kubernetes/redis.yaml
    kubectl apply --recursive -f kubernetes/grafana.yaml
    kubectl apply --recursive -f kubernetes/logger.yaml
    kubectl apply --recursive -f kubernetes/webapp.yaml
    sleep 10
    kubectl apply --recursive -f kubernetes/renderer.yaml
    kubectl apply --recursive -f kubernetes/api.yaml
    kubectl apply --recursive -f kubernetes/storage.yaml
    kubectl apply --recursive -f kubernetes/ingress.yaml
    echo ""
    echo "Started in $VITAES_ENV environment"
else
    echo "Starting in development environment..."
    echo ""
    docker-compose up --build --detach
    echo ""
    echo "Started in development environment"
fi