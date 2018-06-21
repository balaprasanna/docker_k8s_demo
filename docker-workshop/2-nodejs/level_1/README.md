*Dockerfile commands*
### [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir)

### [RUN](https://docs.docker.com/engine/reference/builder/#run)

### [CMD](https://docs.docker.com/engine/reference/builder/#cmd)

For [more](https://docs.docker.com/engine/reference/builder/) about docker file.

### docker build
```
docker build --no-cache -t node-express-api:0.0.1 .
```

### docker run
```
docker run --name rest-api-v1 -d -p 8080:80 node-express-api:0.0.1
```

### docker stop,rm
```
docker stop rest-api-v1
docker rm rest-api-v1
```

## Time to Think 
### Can you reach the api at localhost:8080/api ?
**Think** Why you cannot reach the api endpoint ??