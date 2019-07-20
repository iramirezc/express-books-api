const express = require('express')
const server = express()

// set-up express middlewares
require('./config/express')(server)

// config models and routes
// NOTE: models should always go first
require('./config/models')(server)
require('./config/routes')(server)

module.exports = server
