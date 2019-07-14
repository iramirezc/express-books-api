#! /bin/bash
docker build -t iramirezc/express-books-api .
docker image ls -f=reference='iramirezc/*'