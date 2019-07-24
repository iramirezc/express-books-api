const express = require('express')
const server = express()

// NOTE: models should be config first
require('./config/models')()

// set-up express middlewares
require('./config/express')(server)

// config express routes
require('./config/routes')(server)

module.exports = server
