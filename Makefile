# initital setup
setup:
	docker volume create express_books_api_node_modules
	docker volume create express_books_api_mongo_db

# install node dependencies
install:
	docker-compose run --rm express-books-api yarn install

# starts app
start:
	docker-compose up

# starts app in development mode
dev:
	docker-compose -f docker-compose.yaml -f ./docker/compose.dev.yaml up express-books-api

# starts app in debugging mode
debug:
	docker-compose -f docker-compose.yaml -f ./docker/compose.debug.yaml up express-books-api

# runs app tests on docker
test:
	docker-compose run --rm express-books-api yarn test

# runs and watch app tests on docker
test-watch:
	docker-compose run --rm express-books-api yarn test --watch

# runs tests in debuggin and watch mode
test-debug:
	yarn test --watch --inspect-brk --no-timeout

# stops all containers
stop:
	docker stop express-books-api
	docker stop express-books-db

# stops api container
stop-api:
	docker stop express-books-api

# stops mongodb container
stop-mongo:
	docker stop express-books-db

# runs only mongodb container
mongo:
	docker-compose up -d express-books-db

# executes the mongo shell on the mongodb container
mongo-shell:
	docker exec -it express-books-db mongo

# executes the bash on the mongodb container
mongo-bash:
	docker exec -it express-books-db bash
