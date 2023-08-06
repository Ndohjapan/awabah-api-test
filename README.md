# Awabah Assessment API

Inventory Management API

### API Documentation: 
https://documenter.getpostman.com/view/19861520/2s9XxySE5p

## Setup Development Environment
- ### Setup Redis
    You can either set up using docker or on your local computer
    - Using Docker
    ```
    docker run --name message-api-redis  -p 6379:6379 -d redis
    ```
    - Install on your computer: 
    https://redis.io/docs/getting-started/installation/

- ### Setup Mongodb
    You can set up using docker or install on your local computer
    - Using docker
    ```
    docker pull mongo
    docker run --name messag-api-db -p 27017:27017 -d mongo
    ```
    - Install on your computer: https://www.mongodb.com/docs/manual/installation/

- ### Install Node Packages
    ```
    npm install 
    ```    

- ### Start App
    You can start the app immediately using 
    ```
    npm run dev
    ```

    or

    You can populate the database with some users before starting the application
    ```
    npm run seed:up
    npm run dev
    ```

    You will have the following users in your database
    ```
    {
      name: "Ndoh Joel",
      email: "admin1@mail.com"
      type: "main-admin",
      permissions: ["all"]
      password: "P4ssword@"
    },
    {
      username: "John Doe",
      email: "admin2@mail.com"
      type: "sub-admin",
      permissions: ["create product"]
      password: "P4ssword@"
    },
    ```

    You can also clear the database any time
    ```
    npm run seed:down
    ```
## Setup Test
- ### Setup Redis
    You can either set up using docker or on your local computer
    - Using Docker
    ```
    docker run --name message-api-redis  -p 6379:6379 -d redis
    ```
    - Install on your computer: 
    https://redis.io/docs/getting-started/installation/

- ### Setup Mongodb
    You can set up using docker or install on your local computer
    - Using docker
    ```
    docker pull mongo
    docker run --name messag-api-db -p 27017:27017 -d mongo
    ```
    - Install on your computer: https://www.mongodb.com/docs/manual/installation/
     
- ### Start Test
    ```
    npm run test
    ```

