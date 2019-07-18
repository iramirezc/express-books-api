const { normalizePort } = require('../common/utils')

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SERVER: {
    host: process.env.SERVER_HOST || '127.0.0.1',
    port: normalizePort(process.env.SERVER_PORT || 3000)
  },
  MONGO_DB: {
    host: process.env.MONGO_DB_HOST,
    port: process.env.MONGO_DB_PORT,
    name: process.env.MONGO_DB_NAME,
    options: {
      useNewUrlParser: true
    }
  }
}
