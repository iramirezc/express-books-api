const bodyParser = require('body-parser')

/**
 * Install express middlewares
 */
module.exports = server => {
  server.use(bodyParser.json())
}
