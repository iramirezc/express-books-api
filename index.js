const { SERVER, MONGO_DB } = require('./src/config')
const { normalizePort, formatDBUri } = require('./src/common/utils')
const mongodb = require('./src/config/mongoose')
const server = require('./src/server')

mongodb
  .connect(formatDBUri(MONGO_DB), MONGO_DB.options)
  .then(connection => {
    process.on('SIGINT', function () {
      connection.close(function () {
        console.log('MongoDB: default connection is disconnected due to application termination.')
        process.exit(0)
      })
    })

    const host = SERVER.host || '127.0.0.1'
    const port = normalizePort(SERVER.port || '3000')

    server.listen(port, host, () => {
      console.log(`NODE_ENV=${server.get('env')}`)
      console.log(`Server running on: 'http://${host}:${port}'`)
    })
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
