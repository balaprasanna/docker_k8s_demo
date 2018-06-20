DOCS: https://hub.docker.com/_/nginx/

### docker run
```
docker run --name some-nginx -d -p 8080:80 nginx:latest
```

### docker ps
```
docker ps
docker ps -a
docker ps -aq
```

### docker stop,rm
```
docker stop some-nginx
docker rm some-nginx
```