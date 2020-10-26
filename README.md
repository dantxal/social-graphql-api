# social-graphql-api

This is a GraphQL API built with Koa for consuming with a Relay front-end.
You can check out the Web App I built to consume this API at [dantxal/socialapp-challenge](https://github.com/dantxal/socialapp-challenge).

Features:

-   You can create posts and comments;
-   GraphiQL Playground at PORT/graphiql;
-   Integration with a Mongo database (mongoose);
-   Completely typed;
-   Relay compatible pagination (first, last, after, before);
-   Seeding script of posts and comments, with logs.

## Installation & Usage

**Before running the project** you need to have an instance of MongoDB to connect to.
Then set environment variables at '.env' file.


:warning: If you're using **docker's** "mongo" image, make sure to **run it using --auth option and setting environment variables for user and password**,
for more information about doing this refer to [mongo's image page](https://hub.docker.com/_/mongo) and [these docs](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-auth).

```
docker run --name some-mongo 
-e MONGO_INITDB_ROOT_USERNAME=admin 
-e MONGO_INITDB_ROOT_PASSWORD=example 
-d -p 27017:27017 
mongo --auth
```


```
#HTTP
git clone https://github.com/dantxal/social-graphql-api.git 

#SSH
git clone git@github.com:dantxal/social-graphql-api.git 

yarn copy-env

# Add vars to .env

yarn 
```

**dev mode** 

`yarn dev`

**production mode** 

`yarn start`

**seed database** 

`yarn seed`

## Some useful queries
<details>
  <summary>Create Post</summary>
  
  ```
  mutation CreatePost {
    CreatePost(input: {
      title: "Post's title"
      text: "Some awesome information."
    }) {
      postEdge {
        cursor
        node {
          id
          title
          text
        }
      }
    }
  }
  ```
  
</details>



<details>
  <summary>Create Comment</summary>
  
  ```
  mutation CreateComment {
    CreateComment (input: {
      postId: "UG9zdDo1Zjk2NDZjYTY1OTQ2NmQ0ODFkN2Q2NTc=" # change it for a valid Post ID
      text: "What a great post 3"
    }) {
      commentEdge {
        cursor
        node {
          id
          text
          createdAt
          updatedAt
        }
      }
    }
  }
  ```
</details>

<details>
  <summary>Query Posts (GET)</summary>
  
  ```
  query GetPostsAndCommentsText{
    posts(first: 3, after: "") {
      edges {
        cursor
        node {
          id
          text
          comments {
            edges {
              node {
                text
              }
            }

          }
        }
      }
    }
  }
  ```
  
</details>

<details>
  <summary>Update Post</summary>
  
  ```
  mutation UpdatePost {
    UpdatePost (input: {
      postId: "UG9zdDo1ZjhmOTljMDFhM2U2MjM0OGMzOWEzYWM=", # change it for a valid Post ID
      title: "First Post"
      text: "They apply it quite broadly to include database schemas, test plans, the build system, even documentation"
    }) {
      post {
        id
        text
        title
      }
    }
  }
  ```
  
</details>

<details>
  <summary>Delete post</summary>
  
  ```
  mutation DeletePost {
    DeletePost(input: {
      postId: "UG9zdDo1ZjhmOThkYjFhM2U2MjM0OGMzOWEzYWE=", # change it for a valid Post ID
    }) {
      payload {
        id
        text
        title
      }
    }
  }
  ```
  
</details>


## Possible errors and solutions

<details>
  <summary>Error: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017</summary>
  
  This usually happens when running the application, **if you are not running a database instance, or did not set environment variables correctly**.
  **SOLUTION**: Make sure you're running your database instance and have set env vars correctly.
  Docker users may run `docker ps`
  
</details>

<details>
  <summary>MongoError: command find/aggregate requires authentication at ...</summary>
  
  This usually happens if you miss something from the setup database step.
  
  **SOLUTION**:  **Provide 'MONGO_USER', 'MONGO_PASS' and 'MONGO_AUTH_SRC'** environment variables. And if you're running 'mongo' image on docker. Run it using '--auth' option.

  ```
  docker run --name some-mongo 
  -e MONGO_INITDB_ROOT_USERNAME=admin 
  -e MONGO_INITDB_ROOT_PASSWORD=example 
  -d -p 27017:27017 
  mongo --auth
  ```
  
</details>
