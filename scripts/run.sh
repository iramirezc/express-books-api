#! /bin/bash
printf "Stoping express-books-api container... "
docker container stop express-books-api
printf "Removing express-books-api container... "
docker container rm express-books-api
printf "Running express-books-api container... "
docker run -p 8080:8080 -d --name=express-books-api -e NODE_ENV=development -e SERVER_HOST=0.0.0.0 -e SERVER_PORT=8080 iramirezc/express-books-api
# wait 1 second
sleep 1
printf "\nTesting server app...\n"
curl -i localhost:8080/health