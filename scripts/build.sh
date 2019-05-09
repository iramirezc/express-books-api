#! /bin/bash
docker build -t iramirezc/books-api-express .
docker image ls -f=reference='iramirezc/*'