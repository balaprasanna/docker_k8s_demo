
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