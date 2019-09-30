const bodyParser = require('body-parser')
const morgan = require('morgan')

const logger = require('../services').LoggerService.get('HTTP')

/**
 * Install express middlewares
 */
module.exports = server => {
  server.use(bodyParser.json())
  /**
   * Morgan formats:
   * - dev:      2019-09-27T04:29:02.565Z info: GET /health 200 7.921 ms - 50
   * - combined: 2019-09-27T04:31:13.874Z info: 172.19.0.1 - - [27/Sep/2019:04:31:13 +0000] "GET /health HTTP/1.1" 200 50 "-" "curl/7.54.0"
   */
  server.use(morgan('dev', { stream: logger.stream }))
}
