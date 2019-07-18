const { SERVER: { host, port } } = require('./src/config')
const db = require('./src/config/db')
const server = require('./src/server')

db.connect()
  .then(() => {
    process.on('SIGINT', () => {
      db.close().then(() => {
        console.log('MongoDB: default connection is disconnected due to application termination.')
        process.exit(0)
      })
    })
  })
  .then(() => {
    server.listen(port, host, () => {
      console.log(`NODE_ENV=${server.get('env')}`)
      console.log(`Server running on: 'http://${host}:${port}'`)
    })
  })
  .catch(err => {
    console.error('Something went wrong: ', err)
    process.exit(1)
  })
