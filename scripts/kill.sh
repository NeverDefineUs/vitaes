#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    echo "Stopping services in $VITAES_ENV environment..."
    echo ""
    kubectl delete ingress --all
    kubectl delete deployment --namespace kube-system renderer-autoscaler
    kubectl delete deployment --all
    kubectl delete pod --all
    kubectl delete service --all
    echo ""
    echo "Services stopped in $VITAES_ENV environment"
else
    echo "Stopping services in development environment..."
    echo ""
    docker-compose down
    echo ""
    echo "Services stopped in development environment"
fi