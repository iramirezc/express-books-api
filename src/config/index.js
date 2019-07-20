const { deepFreeze, normalizePort, parseBoolean } = require('../shared/utils')

/**
 * All default values are configured
 * towards development environment.
 */
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER: {
    host: process.env.SERVER_HOST || '127.0.0.1',
    port: normalizePort(process.env.SERVER_PORT || 3000)
  },
  MONGO_DB: {
    host: process.env.MONGO_DB_HOST || '127.0.0.1',
    port: normalizePort(process.env.MONGO_DB_PORT || 27017),
    name: process.env.MONGO_DB_NAME || 'test',
    // Read more about connection options here:
    // https://mongoosejs.com/docs/connections.html
    options: {
      // From mongoose Docs:
      // You should set useNewUrlParser: true
      // unless that prevents you from connecting.
      useNewUrlParser: true,
      // Index builds can cause performance
      // degradation for large production
      // deployments. Disable on production.
      autoIndex: parseBoolean(process.env.MONGO_DB_AUTO_INDEX, true)
    },
    // Read more about mongoose options here:
    // https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-set
    settings: {
      // bufferCommands if 'false', disables default mongoose buffer
      // and fails queries immediately when mongo is disconnected.
      bufferCommands: parseBoolean(process.env.MONGO_DB_BUFFER_COMMANDS, true),
      // All executed collection methods
      // will log their arguments to the console.
      debug: parseBoolean(process.env.MONGO_DB_DEBUG, false)
    }
  }
}

module.exports = deepFreeze(config)
