# docker-compose
setup:
	docker volume create express_books_api_node_modules
	docker volume create express_books_api_mongo_db

install:
	docker-compose run --rm express-books-api yarn install

start:
	docker-compose up

dev:
	docker-compose -f docker-compose.yaml -f ./docker/compose.dev.yaml up express-books-api

debug:
	docker-compose -f docker-compose.yaml -f ./docker/compose.debug.yaml up express-books-api

test:
	docker-compose run --rm express-books-api yarn test --watch

test-debug:
	yarn test --watch --inspect-brk --no-timeout

stop:
	docker stop express-books-api
	docker stop express-books-db

# mongo docker container
mongo:
	docker-compose up -d express-books-db

mongo-shell:
	docker exec -it express-books-db mongo

mongo-bash:
	docker exec -it express-books-db bash
