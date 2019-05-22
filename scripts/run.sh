#! /bin/bash
printf "Stoping books-api container... "
docker container stop books-api
printf "Removing books-api container... "
docker container rm books-api
printf "Running books-api container... "
docker run -p 8080:8080 -d --name=books-api -e NODE_ENV=development -e SERVER_HOST=0.0.0.0 -e SERVER_PORT=8080 iramirezc/books-api-express
# wait 1 second
sleep 1
printf "\nTesting server app...\n"
curl -i localhost:8080