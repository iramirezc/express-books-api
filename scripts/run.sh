#! /bin/bash
printf "Stoping books-api container... "
docker container stop books-api
printf "Removing books-api container... "
docker container rm books-api
printf "Running books-api container... "
docker run -p 8080:8080 -d --name=books-api iramirezc/books-api-express
sleep 0.5
printf "\nTesting server app...\n"
curl -i localhost:8080