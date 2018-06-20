#!/bin/bash
docker run --name some-nginx -d -p 8080:80 -v `pwd`/ui/build/:/usr/share/nginx/html:ro nginx:latest