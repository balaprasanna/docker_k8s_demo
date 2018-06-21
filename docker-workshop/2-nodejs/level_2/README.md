*Dockerfile commands*
### [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir)

### [RUN](https://docs.docker.com/engine/reference/builder/#run)

### [CMD](https://docs.docker.com/engine/reference/builder/#cmd)

For [more](https://docs.docker.com/engine/reference/builder/) about docker file.

### [.dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file)

### docker build
```
docker build --no-cache -t node-express-api:0.0.1 .
```

### docker run
```
docker run --name rest-api-v1 -d \
    -p 3000:3000 \
    -v `pwd`/api:/src \
    node-express-api:0.0.1 ./start.sh
```

### docker stop,rm
```
docker stop rest-api-v1
docker rm rest-api-v1
```