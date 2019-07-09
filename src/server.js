const express = require('express')
const server = express()

// append models
// NOTE: models always go first
require('./config/models')(server)

// set-up plugins
require('./config/plugins')(server)

// append routes
require('./config/routes')(server)

module.exports = server
