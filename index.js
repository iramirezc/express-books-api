const { SERVER: { host, port } } = require('./src/config')
const db = require('./src/config/db')
const server = require('./src/server')
const logger = require('./src/services').LoggerService.get('Server', { level: 'info' })

db.connect()
  .then(() => {
    process.on('SIGINT', () => {
      db.close().then(() => {
        logger.info('mongoDB default connection is disconnected due to application termination.')
        process.exit(0)
      })
    })
  })
  .then(() => {
    server.listen(port, host, () => {
      logger.info(`listening on: 'http://${host}:${port}'`)
      logger.info(`NODE_ENV=${server.get('env')}`)
    })
  })
  .catch(err => {
    logger.error('something went wrong: ', err)
    process.exit(1)
  })
