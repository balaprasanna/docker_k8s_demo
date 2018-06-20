### docker build
```
docker build --no-cache -t my-custom-nginx:0.0.1 .
```

### docker run
```
docker run --name some-content-nginx -d -p 8080:80 my-custom-nginx:0.0.1
```

### docker stop,rm
```
docker stop some-content-nginx
docker rm some-content-nginx
```