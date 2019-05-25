#!/bin/bash
if [ "$VITAES_ENV" == "production" ];
then
    echo "Setting up in production environment..."
    echo ""
    doctl k8s cluster kubeconfig save vitaes
    kubectl config use-context $(doctl k8s cluster kubeconfig show -o text vitaes | grep current-context: | sed -E  's/.*: (.*)/\1/')
    echo ""
    echo "Setup done for production environment"
elif [ "$VITAES_ENV" == "staging" ];
then
    # TBD. For now same as production
    echo "Setting up in staging environment..."
    echo ""
    doctl k8s cluster kubeconfig save vitaes
    kubectl config use-context $(doctl k8s cluster kubeconfig show -o text vitaes | grep current-context: | sed -E  's/.*: (.*)/\1/')
    echo ""
    echo "Setup done for staging environment"
else
    echo "Setting up in development environment..."
    echo ""
    docker volume create grafana-volume
    docker volume create influxdb-volume
    docker volume create log-volume
    cp ./hooks/* ./.git/hooks/
    chmod +x .git/hooks/pre-commit
    echo ""
    echo "Setup done for development environment"
fi
