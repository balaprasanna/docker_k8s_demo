#!/bin/bash
docker run --name rest-api-v1 -d \
    -p 3000:3000 \
    -v `pwd`/api:/src \
    node-express-api:0.0.1 ./start.sh