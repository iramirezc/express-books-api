# Express.js Books API

A Dockerized Bookshelf API using Express.js

## Using the `Makefile`

### `make setup`

Creates a docker volume named `books_node_modules`.

### `make install`

Installs node dependencies using the `docker-compose.build.yaml` file.

### `make dev`

Runs server on `development` mode.

### `make debug`

Runs server on `debug` mode.

### `make test-debug`

Runs the server's unit tests in debugger and watch mode. Requires `debugger` keyword.

## Using the `package.json`

### `yarn start`

Runs the server.

### `yarn dev`

Runs the server in `development` mode using `nodemon`.

### `yarn debug`

Runs the server in `debug` mode starting with a breakpoint.

### `yarn test`

Runs server's unit and functional tests using `dot` reporter.

### `yarn test:unit`

Runs server's unit tests.

### `yarn test:func`

Runs server's functional tests.

### `yarn test:cov`

Runs server's unit tests coverage both for unit and functional tests.

Tests results will be reported with `nyan`.

Coverage will be reported with `summary-text` and `html`.

### `yarn test:sanity`

Runs only the server's tests tagged with `#sanity`.
