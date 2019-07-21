# Dockerized Express.js Books API + MongoDB

A fully functional Dockerized Express.js API with a CRUD implementation to manage Books.

I built this starter project with all my personal preferences and learning from [different resources](./acknowledgment.md), that said, **used it at your own risk!.**

I thought to be a good idea to have a more real project to practice with rather than having toy projects and *ToDo* lists all over the place.

## Requirements

* Docker
* Node.js 10.15.x
* MongoDB (if running on localhost)

## Quick start

Get the server running using the `Makefile`

```sh
make
```

or use the `package.json` *(a MongoDB server should be running on localhost:27017)*

```sh
export MONGO_DB_NAME=books-dev
yarn install
yarn start
```

finally, curl the `/health` endpoint

```sh
curl localhost:8080/health
```

you should get and output like this one:

```sh
{"status":"success","data":{"api":true,"db":true}}
```

## What's included?

```txt
.
├── docker                <-- Compose files per environment
├── src                   <-- Server's source code
│   └── config            <-- Env vars, settings, and all that stuff
│   └── controllers       <-- Routes handlers
│   └── models            <-- Mongoose models
│   └── routes            <-- API endpoints
│   └── services          <-- Singleton services
│   └── shared            <-- Utils & common code
│   └── test              <-- Tests tools & mocks
│   └── server.js         <-- Express.js server
├── acknowledgment.md     <-- Compendium of great resources
├── docker-compose.yaml   <-- Base docker-compose file with default configuration
├── Dockerfile            <-- Build a docker image from this project
├── index.js              <-- Server's entry point
├── Makefile              <-- Useful commands for development
├── package.json          <-- Node.js dependencies and scripts
├── README.MD             <-- This instructions file
```

## Local development using the `Makefile`

Most of these scripts execute `docker` or  `docker-compose` commands behind the scenes. Refer to the [Makefile](./Makefile) for more details. For now, here's a quick guide to get you started with:

Create the `docker volumes` needed for docker compose:

* `express_books_api_node_modules`
* `express_books_api_mongo_db`

```sh
# run this command the very first time
make setup
```

Install `node_modules` dependencies

```sh
# run this command whenever you add more node.js dependencies
make install
```

Run the server with the default values

```sh
make start
```

Run the server in `development` mode with `nodemon`

```sh
make dev
```

Run the server in `debugging` mode on port `9229`

```sh
make debug
```

> Use this configuration for `VSCode`

```json
{
  "name": "Docker: Attach to Node",
  "type": "node",
  "request": "attach",
  "remoteRoot": "/usr/src/app",
  "port": 9229,
  "address": "127.0.0.1",
  "localRoot": "${workspaceFolder}",
  "protocol": "inspector"
}
```

Runs both unit and functional tests

```sh
make test
```

Runs all tests in watch mode

```sh
make test-watch
```

Runs the `api` container

> `make dev` alias

```sh
make api
```

Runs the `mongo` container

```sh
make mongo
```

Stops both the `api` and `mongo` containers

```sh
make stop
```

### `Package.json` scripts

Runs the server with default values:

```sh
yarn start
```

Runs the server in `development` mode using `nodemon`:

```sh
yarn dev
```

Runs the server in `debug` mode starting with a breakpoint:

```sh
yarn debug
```

Runs server's unit and functional tests using `dot` reporter:

```sh
yarn test
```

Runs only server's unit tests:

```sh
yarn test:unit
```

Runs only server's functional tests.

```sh
yarn test:func
```

Runs server's unit tests coverage both for unit and functional tests.

```sh
yarn test:cov
```

> Tests results will be reported with `nyan`.
>
> Coverage will be reported with `summary-text` and `html`.

Runs only the server's tests tagged with `#sanity`.

```sh
yarn test:sanity
```

### Docker Commands Cheat Sheet

Build docker image using the Dockerfile

```sh
docker build -t iramirezc/express-books-api .
```

List all docker images with the prefix `iramirezc`

```sh
docker image ls -f=reference='iramirezc/*'
```

Run the docker image

```sh
docker run -p 8080:8080 -d --name=express-books-api iramirezc/express-books-api
```

Open a shell terminal in the `express-books-api` container to run commands

```sh
docker exec -it express-books-api sh
```

Test if `express-books-api` container is running the server correctly

```sh
curl -i localhost:8080/health
# {"status":"success","data":{"api":true,"db":true}}
```

Logs for `express-books-api` container

```sh
docker logs -f express-books-api
```

Run multiple commands in a docker-compose file

```yaml
# in the command key wrap all the commands in quotes
command: sh -c "yarn install && yarn dev"
```

Copy a file from the host to the container

```sh
docker cp host-file.ext container-name:/path/to/file.ext
```
