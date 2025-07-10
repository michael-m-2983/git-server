#!/bin/bash

echo "Starting git-server..."

docker run \
    --rm \
    -it \
    --user $(id -u):$(id -g) \
    -p 3000:80 \
    -v "./repos:/repos" \
    $(docker build --network=host -q .)
