const mongoose = require('mongoose')

const { whenEnv } = require('../common/utils')

let dbConnection = null

/**
 * Mutates the dbConfig object
 * and configures mongoose
 * depending on the environment.
 * Finally, it listens to connecting
 * and connected events.
 * @param {object} dbConfig MongoDB config object
 * @param {string} dbConfig.uri MongoDB Uri
 * @param {object} dbConfig.options MongoDB options
 */
function initialConfig(dbConfig) {
  whenEnv('test', () => {
    // Change db name
    dbConfig.uri = `${dbConfig.uri}-test`
  })

  whenEnv('development', () => {
    // All executed collection methods
    // will log output of their arguments
    // to the console.
    mongoose.set('debug', true)
    // Change db name
    dbConfig.uri = `${dbConfig.uri}-dev`
  })

  whenEnv('production', () => {
    // Disable default mongoose buffer
    // and fail when connection is disconnected.
    mongoose.set('bufferCommands', false)
    // index builds can cause performance degradation
    // for large production deployments.
    dbConfig.options.autoIndex = false
  })

  mongoose.connection.on('connecting', () => {
    console.log(`MongoDB: connecting to '${dbConfig.uri}' ...`)
    console.log('MongoDB: with options:', JSON.stringify(dbConfig.options))
  })

  mongoose.connection.on('connected', () => {
    console.log('MongoDB: connected!')
  })
}

/**
 * Resolves the connection promise and
 * registers mongoose events listeners 
 * when connection is successful.
 * Finally, sets 'dbConnection'
 * to use it as a singleton.
 * @param {function} resolve Resolver function
 */
function onConnectionSuccess(resolve) {
  mongoose.connection.on('disconnecting', () => console.log('MongoDB: disconnecting...'))
  mongoose.connection.on('disconnected', () => console.log('MongoDB: disconnected!'))
  mongoose.connection.on('close', () => console.log('MongoDB: closed!'))
  mongoose.connection.on('reconnected', () => console.log('MongoDB: reconnected!'))
  mongoose.connection.on('error', err => console.log(`MongoDB: error: ${String(err)}`))
  mongoose.connection.on('reconnectFailed', () => {
    console.log('MongoDB: reconnection failed!')
    process.exit(1)
  })

  dbConnection = mongoose.connection

  resolve(dbConnection)
}

/**
 * Rejects the connection promise
 * @param {function} reject Rejector function
 * @returns {function} Error handler function
 */
function onConnectionError(reject) {
  return function(err) {
    console.error(`MongoDB: Error while trying to connect: ${String(err)}`)
    reject(err)
  }
}

/**
 * Connects to a MongoDB server
 * @param {string} dbUri MongDB URI string
 * @param {object} dbOptions MongoDB Options
 * @returns {Promise} That resolves with the dbConnection
 */
function connect(dbUri, dbOptions) {
  if (dbConnection === null) {
    const dbConfig = {
      uri: dbUri,
      options: Object.assign({}, dbOptions)
    }

    initialConfig(dbConfig)

    return new Promise((resolve, reject) => {
      mongoose
        .connect(dbConfig.uri, dbConfig.options)
        .then(() => {
          return onConnectionSuccess(resolve)
        })
        .catch(onConnectionError(reject))
    })
  } else {
    return Promise.resolve(dbConnection)
  }
}

module.exports = {
  connect
}
