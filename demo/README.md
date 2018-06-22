
*Step 1* Prepare your environments

- We need a database container.
    - Lets search for mongo

        ```
        docker search mongo
        ```
    - Lets pull mongo
        ```
        docker pull mongo
        ```
    - Lets run the mongo db container
        ```
        docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=supersecret mongo
        ```
    - Lets stick to the database name as `appdb`

*Step 2* Build the backend container

- We need to pull the source code from `stage1-build-backend` branch
    - [stage1-build-backend](https://github.com/balaprasanna/docker_k8s_workshop/tree/stage1-build-backend/demo)
    - Lets build the backend api image
        ```
        docker build -t backend:0.0.1 .
        ```

        Expected result
        ```
        $ docker build -t backend:0.0.1 .
        Sending build context to Docker daemon  164.4kB
        Step 1/8 : FROM node
        ---> d888b6980748
        Step 2/8 : WORKDIR /usr/src/app
        ---> Using cache
        ---> 124d7c2b3c22
        Step 3/8 : RUN npm i npm@latest -g
        ---> Running in 8e4ef78bbdba

        /usr/local/bin/npm -> /usr/local/lib/node_modules/npm/bin/npm-cli.js
        /usr/local/bin/npx -> /usr/local/lib/node_modules/npm/bin/npx-cli.js
        + npm@6.1.0
        added 247 packages, removed 41 packages and updated 129 packages in 37.885s
        Removing intermediate container 8e4ef78bbdba
        ---> 9969709c0f4f
        Step 4/8 : COPY package*.json ./
        ---> 6c7fbb951cd9
        Step 5/8 : RUN npm install
        ---> Running in dfc3c6d8a171
        added 475 packages from 430 contributors and audited 2806 packages in 16.538s
        found 7 vulnerabilities (2 low, 4 moderate, 1 high)
        run `npm audit fix` to fix them, or `npm audit` for details
        Removing intermediate container dfc3c6d8a171
        ---> 77dbb58bab3f
        Step 6/8 : COPY . .
        ---> fa05b8b136d0
        Step 7/8 : EXPOSE 3000
        ---> Running in b933cef0edd8
        Removing intermediate container b933cef0edd8
        ---> b9d9f04defeb
        Step 8/8 : CMD [ "npm", "start" ]
        ---> Running in 5aaafd3f25bc
        Removing intermediate container 5aaafd3f25bc
        ---> a2c1ee38c555
        Successfully built a2c1ee38c555
        Successfully tagged backend:0.0.1
        ```

    - Now list all the available images
        - 
        ```
        docker images
        $ docker images
        REPOSITORY             TAG                 IMAGE ID           CREATED             SIZE
        backend                0.0.1               a2c1ee38c555        3 minutes ago       791MB
        ``` 

    - Now lets run this image.
        ```
        docker run --name backend -p 3000:3000 backend:0.0.1
        ```

### Oh no!. We got an error

```
$ docker run --name backend -p 3000:3000 backend:0.0.1

> backend@1.0.0 start /usr/src/app
> node .

Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer
Connection fails: MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]
It will be retried for the next request.

/usr/src/app/node_modules/mongodb/lib/mongo_client.js:421
          throw err
          ^
MongoError: failed to connect to server [localhost:27017] on first connect [MongoError: connect ECONNREFUSED 127.0.0.1:27017]
    at Pool.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/topologies/server.js:336:35)
    at Pool.emit (events.js:180:13)
    at Connection.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/connection/pool.js:280:12)
    at Object.onceWrapper (events.js:272:13)
    at Connection.emit (events.js:180:13)
    at Socket.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/connection/connection.js:189:49)
    at Object.onceWrapper (events.js:272:13)
    at Socket.emit (events.js:180:13)
    at emitErrorNT (internal/streams/destroy.js:64:8)

```

## We are unable to connect to the mongodb container

- Discuss the issue
- Plan & solve this issue

## The solution is Docker Networking

- Lets create a network namespace
```
docker network create app_network
```

- Lets stop already running containers

```
docker stop backend
docker stop mongodb
docker rm backend
docker rm mongodb
```

- Lets re-run our containers under the namespace created
`app_network`

```
docker network ls
```
```
$ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
f5ee60a87290        app_network         bridge              local
51492a4b4179        bridge              bridge              local
f8f2bc4e5123        host                host                local
22806a478f69        none                null                local

```

- Run DB Container 
    ```
    docker run -d --name mongodb --net app_network -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=supersecret -e MONGO_INITDB_DATABASE=appdb mongo
    ```
- Run Backend Container    - 
    ```
    docker run --name backend --net app_network -p 3000:3000 backend:0.0.1
    ```

## Stil we have errors.

This is another good chance to show how to rebuild an image and see how it can build the image much faster than the last time.

## Important Section below !!!
**Fix**
- We can use this image `aashreys/mongo-auth:latest` instead of `official mongo`
- You can reach the container using the name of the container.
- This idea will be carried over to K8S.


Make sure you are in the right directory.
```
docker build -t backend:0.0.2 .
```

**Good to have a look at the difference from perevious stage**
![Diff from pevious stage](backend/backend_container_replace_localhost_container_name.png)


- Lets stop already running containers

```
docker stop backend
docker stop mongodb
docker rm backend
docker rm mongodb
```

#### Run the docker 
```
docker run -d --name mongodb \
--net app_network -p 27017:27017 \
-e AUTH=yes -e MONGODB_ADMIN_USER=admin \
-e MONGODB_ADMIN_PASS=admin \
-e MONGODB_APPLICATION_DATABASE=appdb \
-e MONGODB_APPLICATION_USER=root \
-e MONGODB_APPLICATION_PASS=supersecret \
 aashreys/mongo-auth:latest
```

```
docker run --name backend \
--net app_network \
-d -p 3000:3000 \
backend:0.0.2
```

### WOW. Now we are running two containers.
1. mongo db container to server as a datastore
2. backend container to run the node.js application
3. Both of them are talking to each other in a same network namespace.

### Explore the API here
Go to this url to explore the API
[http://localhost:3000/explorer/#/](http://localhost:3000/explorer/#/)

You will see something like this.
![lb](backend/lb1.png)


## For this stage. refer to frontend folder
- [frontend](frontend/)
- [frontend/todo-app](frontend/todo-app/)o


## For docker-compose

- Locate the docker-compose.yml file and run the follwing
```
docker-compose up
```

Expected Output
```
Removing intermediate container 8fea73cecbf5
Step 8/10 : COPY . .
 ---> f3c41fc4bb38
Step 9/10 : EXPOSE 3000
 ---> Running in 5e6bde3e9b09
 ---> 95dfd5444230
Removing intermediate container 5e6bde3e9b09
Step 10/10 : CMD npm start
 ---> Running in fef55cf5540b
 ---> 03f79b842644
Removing intermediate container fef55cf5540b
Successfully built 03f79b842644
Successfully tagged frontend:0.0.2
WARNING: Image for service frontend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating mongodb ...
Creating mongodb ... done
Creating demo_backend_1 ...
Creating demo_backend_1 ... done
Creating demo_frontend_1 ...
Creating demo_frontend_1 ... done
Attaching to mongodb, demo_backend_1, demo_frontend_1
mongodb     | => Waiting for confirmation of MongoDB service startup...
mongodb     | 2018-06-22T21:39:29.378+0000 I CONTROL  [initandlisten] MongoDB starting : pid=5 port=27017 dbpath=/data/db 64-bit host=ecb38323dfb2
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] db version v3.4.5
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] git version: 520b8f3092c48d934f0cd78ab5f40fe594f96863
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.0.1t  3 May 2016
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] allocator: tcmalloc
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] modules: none
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] build environment:
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten]     distmod: debian81
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten]     distarch: x86_64
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten]     target_arch: x86_64
mongodb     | 2018-06-22T21:39:29.379+0000 I CONTROL  [initandlisten] options: { security: { authorization: "enabled" } }
mongodb     | 2018-06-22T21:39:29.402+0000 I STORAGE  [initandlisten]
mongodb     | 2018-06-22T21:39:29.402+0000 I STORAGE  [initandlisten] ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
mongodb     | 2018-06-22T21:39:29.402+0000 I STORAGE  [initandlisten] **          See http://dochub.mongodb.org/core/prodnotes-filesystem
mongodb     | 2018-06-22T21:39:29.402+0000 I STORAGE  [initandlisten] wiredtiger_open config: create,cache_size=487M,session_max=20000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000),checkpoint=(wait=60,log_size=2GB),statistics_log=(wait=0),
mongodb     | 2018-06-22T21:39:29.495+0000 I CONTROL  [initandlisten] ** WARNING: You are running this process as the root user, which is not recommended.
mongodb     | 2018-06-22T21:39:29.496+0000 I CONTROL  [initandlisten]
mongodb     | 2018-06-22T21:39:29.549+0000 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/data/db/diagnostic.data'
mongodb     | 2018-06-22T21:39:29.575+0000 I INDEX    [initandlisten] build index on: admin.system.version properties: { v: 2, key: { version: 1 }, name: "incompatible_with_version_32", ns: "admin.system.version" }
mongodb     | 2018-06-22T21:39:29.575+0000 I INDEX    [initandlisten]    building index using bulk method; build may temporarily use up to 500 megabytes of RAM
mongodb     | 2018-06-22T21:39:29.576+0000 I INDEX    [initandlisten] build index done.  scanned 0 total records. 0 secs
mongodb     | 2018-06-22T21:39:29.576+0000 I COMMAND  [initandlisten] setting featureCompatibilityVersion to 3.4
mongodb     | 2018-06-22T21:39:29.577+0000 I NETWORK  [thread1] waiting for connections on port 27017
backend_1   |
backend_1   | > backend@1.0.0 start /usr/src/app
backend_1   | > node .
backend_1   |
mongodb     | 2018-06-22T21:39:34.619+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:42352 #1 (1 connection now open)
mongodb     | 2018-06-22T21:39:34.624+0000 I ACCESS   [conn1] note: no users configured in admin.system.users, allowing localhost access
mongodb     | 2018-06-22T21:39:34.636+0000 I NETWORK  [conn1] received client metadata from 127.0.0.1:42352 conn1: { application: { name: "MongoDB Shell" }, driver: { name: "MongoDB Internal Client", version: "3.4.5" }, os: { type: "Linux", name: "PRETTY_NAME="Debian GNU/Linux 8 (jessie)"", architecture: "x86_64", version: "Kernel 4.9.49-moby" } }
mongodb     | => Creating admin user with a password in MongoDB
mongodb     | 2018-06-22T21:39:34.693+0000 I -        [conn1] end connection 127.0.0.1:42352 (1 connection now open)
mongodb     | MongoDB shell version v3.4.5
mongodb     | connecting to: mongodb://127.0.0.1:27017/admin
mongodb     | 2018-06-22T21:39:35.003+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:42354 #2 (1 connection now open)
mongodb     | 2018-06-22T21:39:35.004+0000 I NETWORK  [conn2] received client metadata from 127.0.0.1:42354 conn2: { application: { name: "MongoDB Shell" }, driver: { name: "MongoDB Internal Client", version: "3.4.5" }, os: { type: "Linux", name: "PRETTY_NAME="Debian GNU/Linux 8 (jessie)"", architecture: "x86_64", version: "Kernel 4.9.49-moby" } }
mongodb     | MongoDB server version: 3.4.5
mongodb     | Successfully added user: {
mongodb     |   "user" : "admin",
mongodb     |   "roles" : [
mongodb     |           {
mongodb     |                   "role" : "root",
mongodb     |                   "db" : "admin"
mongodb     |           }
mongodb     |   ]
mongodb     | }
mongodb     | 2018-06-22T21:39:35.076+0000 I -        [conn2] end connection 127.0.0.1:42354 (1 connection now open)
frontend_1  |
frontend_1  | > todo-app@0.1.0 start /app
frontend_1  | > react-scripts start
frontend_1  |
mongodb     | => Creating a appdb database user with a password in MongoDB
mongodb     | MongoDB shell version v3.4.5
mongodb     | connecting to: mongodb://127.0.0.1:27017/admin
mongodb     | 2018-06-22T21:39:38.296+0000 I NETWORK  [thread1] connection accepted from 127.0.0.1:42356 #3 (1 connection now open)
mongodb     | 2018-06-22T21:39:38.297+0000 I NETWORK  [conn3] received client metadata from 127.0.0.1:42356 conn3: { application: { name: "MongoDB Shell" }, driver: { name: "MongoDB Internal Client", version: "3.4.5" }, os: { type: "Linux", name: "PRETTY_NAME="Debian GNU/Linux 8 (jessie)"", architecture: "x86_64", version: "Kernel 4.9.49-moby" } }
mongodb     | MongoDB server version: 3.4.5
mongodb     | 2018-06-22T21:39:38.394+0000 I ACCESS   [conn3] Successfully authenticated as principal admin on admin
mongodb     | 2018-06-22T21:39:38.415+0000 E QUERY    [thread1] SyntaxError: missing ; before statement @(shell):1:5
mongodb     | switched to db appdb
mongodb     | Successfully added user: {
mongodb     |   "user" : "root",
mongodb     |   "roles" : [
mongodb     |           {
mongodb     |                   "role" : "dbOwner",
mongodb     |                   "db" : "appdb"
mongodb     |           }
mongodb     |   ]
mongodb     | }
mongodb     | bye
mongodb     | 2018-06-22T21:39:38.540+0000 I -        [conn3] end connection 127.0.0.1:42356 (1 connection now open)
frontend_1  | Starting the development server...
frontend_1  |
mongodb     | MongoDB configured successfully. You may now connect to the DB.
mongodb     | $cmd
backend_1   | Web server listening at: http://localhost:3000
mongodb     | 2018-06-22T21:39:40.901+0000 I NETWORK  [thread1] connection accepted from 172.21.0.3:34794 #4 (1 connection now open)
backend_1   | Browse your REST API at http://localhost:3000/explorer
mongodb     | 2018-06-22T21:39:40.980+0000 I NETWORK  [conn4] received client metadata from 172.21.0.3:34794 conn4: { driver: { name: "nodejs", version: "2.2.35" }, os: { type: "Linux", name: "linux", architecture: "x64", version: "4.9.49-moby" }, platform: "Node.js v9.10.1, LE, mongodb-core: 2.1.19" }
mongodb     | 2018-06-22T21:39:41.038+0000 I ACCESS   [conn4] Successfully authenticated as principal root on appdb
mongodb     | 2018-06-22T21:39:41.089+0000 I INDEX    [conn4] build index on: appdb.RoleMapping properties: { v: 2, key: { principalId: 1 }, name: "principalId_1", ns: "appdb.RoleMapping", background: true }
mongodb     | 2018-06-22T21:39:41.089+0000 I INDEX    [conn4] build index done.  scanned 0 total records. 0 secs
frontend_1  | Compiled with warnings.
frontend_1  |
frontend_1  | ./src/App.js
frontend_1  |   Line 22:  Unexpected string concatenation of literals  no-useless-concat
frontend_1  |
frontend_1  | Search for the keywords to learn more about each warning.
frontend_1  | To ignore, add // eslint-disable-next-line to the line before.
frontend_1  |

```


- To tear down.
```
docker-compose down
```


## Lets go to the next stage 
## Kubernetes