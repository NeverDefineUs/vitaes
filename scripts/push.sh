#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    docker tag latexos vitaes/latexos
    docker tag webapp vitaes/webapp
    docker tag renderer vitaes/renderer
    docker tag api vitaes/api
    docker tag logger vitaes/logger
    docker tag storage vitaes/storage
    docker push vitaes/latexos
    docker push vitaes/webapp
    docker push vitaes/renderer
    docker push vitaes/api
    docker push vitaes/logger
    docker push vitaes/storage
    echo ""
    echo "Pushed docker images in $VITAES_ENV environment"
else
    echo "You can't run this in development env"
fi
