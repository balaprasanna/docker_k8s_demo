**INFO**

There is a React App in `ui` folder.
If you want to complete this stage your need to make sure you have create this directory
`ui/build`

But how to create it. You have to do npm install inside that directory
Here are the steps
1. npm install --verbose
2. npm run build

```
$ npm run build

> ui@0.1.0 build /home/std-user01/Projects/teaching/docker_k8s_workshop/docker-workshop/1-nginx/level_4_optional/ui
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  35.72 KB  build/static/js/main.ee7b2412.js
  299 B     build/static/css/main.c17080f1.css

The project was built assuming it is hosted at the server root.
You can control this with the homepage field in your package.json.
For example, add this to build it for GitHub Pages:

  "homepage" : "http://myname.github.io/myapp",

The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build

Find out more about deployment here:

  http://bit.ly/2vY88Kr

```

### docker run
```
docker run --name some-nginx -d -p 8080:80 -v `pwd`/ui/build/:/usr/share/nginx/html:ro nginx:latest
```

### docker stop,rm
```
docker stop some-nginx
docker rm some-nginx
```