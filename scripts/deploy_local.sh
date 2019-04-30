#!/bin/bash

# Deploying to a remote location example:
# $ ssh root@unbrake.ml BRANCH=master bash < deploy.sh

REPO_RAW_PATH="https://raw.githubusercontent.com/fga-eps-mds/2019.1-unbrake/"

if [ ! -e secrets ]; then
    echo -e 'You forgot to copy secrets!!!'
    exit 1
fi

wget -O nginx.api.conf "${REPO_RAW_PATH}/${BRANCH}/unbrake-api/production/nginx.conf"
wget -O nginx.frontend.conf "${REPO_RAW_PATH}/${BRANCH}/unbrake-frontend/production/nginx.conf"
wget -O docker-compose.yml "${REPO_RAW_PATH}/${BRANCH}/production/docker-compose.yml"

# Clean environment
docker-compose stop
docker-compose rm -f
docker rmi -f $(docker images -aq)

docker-compose up -d
