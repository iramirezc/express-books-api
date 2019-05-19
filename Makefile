setup:
	docker volume create books_node_modules

install:
	docker-compose -f docker-compose.build.yaml run --rm install

dev:
	docker-compose up dev

debug:
	docker-compose up debug
