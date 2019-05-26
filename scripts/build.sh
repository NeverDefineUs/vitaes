#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    echo "Building for $VITAES_ENV environment"
    echo ""
    docker build --tag latexos latexos/
    docker build --tag webapp webapp/
    docker build --tag renderer renderer/
    docker build --tag api api/
    docker build --tag logger logger/
    docker build --tag storage storage/
    echo ""
    echo "Built in $VITAES_ENV environment"
else
    echo "Building for development environment"
    echo ""
    docker-compose build
    echo ""
    echo "Built in development environment"
fi