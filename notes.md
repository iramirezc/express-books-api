# Dockerized Express.js Books API

## Useful Commands

### Docker

#### Build Docker image

```sh
docker build -t iramirezc/books-api-express .
```

#### List Docker image

```sh
docker image ls -f=reference='iramirezc/*'
```

#### Run Docker image

```sh
docker run -p 8080:8080 -d --name=books-api iramirezc/books-api-express
```

#### Execute commands in `books-api` container shell

```sh
docker exec -it books-api sh
```

#### Test if `books-api` container is running the app

```sh
curl -i localhost:8080
# Hello world
```

#### Logs for `books-api` container

```sh
docker logs -f books-api
```

#### Run multiple commands in docker-compose

```yaml
command: sh -c "yarn install && yarn dev"
```

## Docs and learning resources

### Docker + Node.js

* [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
* [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#cmd)
* [How To Build a Node.js Application with Docker](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
* [Do not ignore `.dockerignore` (it’s expensive and potentially dangerous)](https://codefresh.io/docker-tutorial/not-ignore-dockerignore/)
* [`.dockerignore` file](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
* [A Better Way to Develop Node.js with Docker](https://hackernoon.com/a-better-way-to-develop-node-js-with-docker-cd29d3a0093)

### Linux

* [Linux `chwon` command](https://linuxize.com/post/linux-chown-command/)

## Questions?

* Is it ok to ignore the `yarn.lock` file?
* How to use nodemon with Docker or something similar?