.PHONY: all setup install start debug test mongo stop

API_VOLUME := express_books_api_node_modules
DB_VOLUME := express_books_api_mongo_db

API_NAME := express-books-api
DB_NAME := express-books-db

BASE_COMPOSE := docker-compose.yaml
DEV_COMPOSE := ./docker/compose.dev.yaml
DEBUG_COMPOSE := ./docker/compose.debug.yaml

# get everything running!
all: setup install start

# tests /health endpoint
health:
	curl localhost:8080/health

# initital setup
setup:
	docker volume create ${API_VOLUME}
	docker volume create ${DB_VOLUME}

# install node dependencies
install:
	docker-compose run --rm ${API_NAME} yarn install

# starts app
start:
	docker-compose up

# starts app in development mode
dev:
	docker-compose -f ${BASE_COMPOSE} -f ${DEV_COMPOSE} up ${API_NAME}

# starts app in debugging mode
debug:
	docker-compose -f ${BASE_COMPOSE} -f ${DEBUG_COMPOSE} up ${API_NAME}

# runs app tests on docker
test:
	docker-compose run --rm ${API_NAME} yarn test

# runs and watch app tests on docker
test-watch:
	docker-compose run --rm ${API_NAME} yarn test --watch

# runs tests in debuggin and watch mode
test-debug:
	yarn test --watch --inspect-brk --no-timeout

# starts api in development mode
api: dev

# opens shell on api container
api-sh:
	docker exec -it ${API_NAME} sh

# runs only mongodb container
mongo:
	docker-compose up -d ${DB_NAME}

# executes the mongo shell on the mongodb container
mongo-shell:
	docker exec -it ${DB_NAME} mongo

# executes the bash on the mongodb container
mongo-bash:
	docker exec -it ${DB_NAME} bash

# stops all containers
stop:
	docker stop ${API_NAME}
	docker stop ${DB_NAME}

# stops api container
stop-api:
	docker stop ${API_NAME}

# stops mongodb container
stop-mongo:
	docker stop ${DB_NAME}
