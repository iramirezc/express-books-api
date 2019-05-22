const express = require('express')

const server = express()

require('./setup/routes')(server)

module.exports = server
