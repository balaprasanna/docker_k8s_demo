DOCS: https://hub.docker.com/_/nginx/

1. docker run
```
docker run --name some-nginx -d -p 8080:80 nginx:latest
```

2. docker stop,rm
```
docker stop some-nginx
docker rm some-nginx
```