#!/bin/bash
if [ "$VITAES_ENV" == "production" ] || [ "$VITAES_ENV" == "staging" ];
then
    if [ ! -z '$1' ]; then
      git pull
      git checkout origin/master
      export VITAES_VERSION=$(cat scripts/version)
      IFS='.' # hyphen (-) is set as delimiter
      read -ra VITAES_VERSION <<< "$VITAES_VERSION"
      export VITAES_MAJOR=${VITAES_VERSION[0]}
      export VITAES_MINOR=${VITAES_VERSION[1]}
      export VITAES_PATCH=${VITAES_VERSION[2]}
      if [ "$1" == "MAJOR" ];then
        export VITAES_MAJOR=$((VITAES_MAJOR+1))
        export VITAES_MINOR=0
        export VITAES_PATCH=0
      elif [ "$1" == "MINOR" ];then
        export VITAES_MINOR=$((VITAES_MINOR+1))
        export VITAES_PATCH=0
      elif [ "$1" == "PATCH" ];then
        export VITAES_PATCH=$((VITAES_PATCH+1))
      else
        exit 1
      fi
      echo "$VITAES_MAJOR.$VITAES_MINOR.$VITAES_PATCH" > scripts/version
      export VITAES_VERSION=$(cat scripts/version)
      echo "Creating Version $VITAES_VERSION"
      git tag "$VITAES_VERSION"
      echo "Creating Version $VITAES_VERSION"

      git push --tags
      echo "Pushing docker images in $VITAES_ENV environment..."
      echo ""
      docker tag storage "vitaes/storage:$VITAES_VERSION"
      docker tag latexos "vitaes/latexos:$VITAES_VERSION"
      docker tag webapp "vitaes/webapp:$VITAES_VERSION"
      docker tag renderer "vitaes/renderer:$VITAES_VERSION"
      docker tag api "vitaes/api:$VITAES_VERSION"
      docker tag logger "vitaes/logger:$VITAES_VERSION"
      docker push "vitaes/storage:$VITAES_VERSION"
      docker push "vitaes/latexos:$VITAES_VERSION"
      docker push "vitaes/webapp:$VITAES_VERSION"
      docker push "vitaes/renderer:$VITAES_VERSION"
      docker push "vitaes/api:$VITAES_VERSION"
      docker push "vitaes/logger:$VITAES_VERSION"
    fi
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
    if [ ! -z '$1' ]; then
      sh scripts/kill.sh
      sh scripts/start.sh    
      kubectl patch deployment api -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
      kubectl patch deployment logger -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
      kubectl patch deployment renderer -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
      kubectl patch deployment storage -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
      kubectl patch deployment webapp -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
    fi
else
    echo "You can't run this in development env"
fi