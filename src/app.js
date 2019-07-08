const express = require('express')
const server = express()

// NOTE: models always go first
require('./setup/models')(server)

// set up plugins

// append routes
require('./setup/routes')(server)

module.exports = server
