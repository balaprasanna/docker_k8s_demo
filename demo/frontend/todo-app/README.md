
### To Build
```
docker build -t todoapp:0.0.2 .
```

### To Run the container.
```
docker run -d --name todoapp -p 80:3000 todoapp:0.0.2
```

### Lets Explore
*Discuss & Show*
- How to do live reloading of the app which is running inside a container.


#### BY Mounting a volume inside the container, we can do live reload.
```
docker run -d -p 80:3000 -v `pwd`:/app todoapp:0.0.2
```

You can go to this link.
[open http://localhost](http://localhost)


### Continue developing..

