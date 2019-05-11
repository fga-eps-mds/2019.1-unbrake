#!/bin/bash

# Deploying to a remote location example:
# $ ssh root@unbrake.ml BRANCH=master bash < deploy.sh

if [ ! -e secrets ]; then
    echo -e 'You forgot to copy secrets!!!'
    exit 1
fi

set -x

DOCKER_COMPOSE_COMMAND="docker-compose -f compose.base.yml -f compose.$ENVIRONMENT.yml"

# Clean environment
$DOCKER_COMPOSE_COMMAND stop
$DOCKER_COMPOSE_COMMAND rm -f
docker rmi -f $(docker images -aq)

$DOCKER_COMPOSE_COMMAND up -d
