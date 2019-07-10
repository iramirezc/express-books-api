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

### Dockerizing Node.js Apps

* [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
* [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#cmd)
* [How To Build a Node.js Application with Docker](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)
* [Do not ignore `.dockerignore` (it’s expensive and potentially dangerous)](https://codefresh.io/docker-tutorial/not-ignore-dockerignore/)
* [`.dockerignore` file](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
* [A Better Way to Develop Node.js with Docker](https://hackernoon.com/a-better-way-to-develop-node-js-with-docker-cd29d3a0093)

### Node.js

* [Design patterns in Node.js: a practical guide](https://blog.logrocket.com/design-patterns-in-node-js/)

### Linux

* [Linux `chwon` command](https://linuxize.com/post/linux-chown-command/)

### Testing

* [An Overview of JavaScript Testing in 2019](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2019-264e19514d0a)
* [Testing A Node/Express Application With Mocha & Chai](https://medium.com/@asciidev/testing-a-node-express-application-with-mocha-chai-9592d41c0083)
* [Express Routes: A TDD Approach](https://medium.com/@jodylecompte/express-routes-a-tdd-approach-1e12a0799352)
* [Test Driven Development: what it is, and what it is not.](https://medium.freecodecamp.org/test-driven-development-what-it-is-and-what-it-is-not-41fa6bca02a2)
* [Node.js & JavaScript Testing Best Practices (2019)](https://medium.com/@me_37286/yoni-goldberg-javascript-nodejs-testing-best-practices-2b98924c9347)
* [Mongoose models and unit tests: The definitive guide](https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/)

#### Chai

* [How to best use Sinon with Chai](https://logrocket.com/blog/sinon-with-chai/)

## Questions?

* Is it ok to ignore the `yarn.lock` file?
