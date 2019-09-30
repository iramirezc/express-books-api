.PHONY: all setup install start health dev api debug test mongo stop

# USAGE:
# make all: gets everything running! Executes: setup, install & start.
# make setup: creates the docker volumes needed.
# make install: installs npm dependencies in the docker volume
# make start: starts the server inside a docker container
# make health: tests the /health endpoint
# make api: alias for make dev
# make api-sh: opens a shell inside the server's docker container
# make dev: runs the server inside a docker container in development mode
# make debug: runs the server inside a docker container in debug mode
# make test: runs the server test inside a docker container
# make test-watch: runs and watch the server tests inside a docker container
# make test-debug: runs the server tests in debugging and watch mode in local
# make test-cov: runs the server tests coverage and opens it in Google Chrome
# make mongo: runs only mongodb container
# make mongo-shell: opens the mongo shell inside the mongodb docker container
# make mongo-bash: opens the bash inside the mongodb docker container
# make stop: stops api and mongodb docker containers
# make stop-api: stops only api's docker container
# make stop-mongo: stops only mongodb's docker container


API_VOLUME := express_books_api_node_modules
DB_VOLUME := express_books_api_mongo_db

API_NAME := express-books-api
DB_NAME := express-books-db

BASE_COMPOSE := docker-compose.yaml
DEV_COMPOSE := ./docker/compose.dev.yaml
DEBUG_COMPOSE := ./docker/compose.debug.yaml

all: setup install start

setup:
	docker volume create ${API_VOLUME}
	docker volume create ${DB_VOLUME}

install:
	docker-compose run --rm ${API_NAME} yarn install

start:
	docker-compose up

health:
	curl localhost:8080/health

dev:
	docker-compose -f ${BASE_COMPOSE} -f ${DEV_COMPOSE} up ${API_NAME}

debug:
	docker-compose -f ${BASE_COMPOSE} -f ${DEBUG_COMPOSE} up ${API_NAME}

test:
	docker-compose run --rm ${API_NAME} yarn test

test-watch:
	docker-compose run --rm ${API_NAME} yarn test --watch

test-debug:
	yarn test --watch --inspect-brk --no-timeout

test-cov:
	yarn test:cov
	open -a Google\ Chrome coverage/index.html

api: dev

api-sh:
	docker exec -it ${API_NAME} sh

mongo:
	docker-compose up -d ${DB_NAME}

mongo-shell:
	docker exec -it ${DB_NAME} mongo

mongo-bash:
	docker exec -it ${DB_NAME} bash

stop:
	docker stop ${API_NAME}
	docker stop ${DB_NAME}

stop-api:
	docker stop ${API_NAME}

stop-mongo:
	docker stop ${DB_NAME}
