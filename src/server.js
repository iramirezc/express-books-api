const express = require('express')
const server = express()

// set-up plugins
require('./config/plugins')(server)

// config models and routes
// NOTE: models should always go first
require('./config/models')(server)
require('./config/routes')(server)

module.exports = server
