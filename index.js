const {
  NODE_ENV,
  SERVER_HOST,
  SERVER_PORT
} = require('./src/config')
const server = require('./src/app')
const { normalizePort } = require('./src/common/utils')

const PORT = normalizePort(SERVER_PORT || '8080')
const HOST = SERVER_HOST || '127.0.0.1'

server.listen(PORT, HOST, () => {
  console.log(`NODE_ENV=${NODE_ENV}`)
  console.log(`Server running on http://${HOST}:${PORT}`)
})
