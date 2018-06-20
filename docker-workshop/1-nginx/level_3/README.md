### Mounting Volumes inside the container
```
docker run --name some-nginx -d -p 8080:80 -v `pwd`/web:/usr/share/nginx/html:ro nginx:latest
```

### docker stop,rm
```
docker stop some-nginx
docker rm some-nginx
```