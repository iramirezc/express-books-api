const mongoose = require('mongoose')
const mongooseConnection = mongoose.connection // mongoose default connection

// dbConnection will eventually be the same as
// the mongoose.connection after initial connection
let dbConnection = null

class MongoDBConnection {
  /**
   * @param {string} dbUri MongoDB Connection String URI
   * @param {object} dbOptions Mongoose Connection Options
   * @param {object} dbSettings Mongoose Settings
   */
  constructor (dbUri, dbOptions, dbSettings) {
    this.uri = dbUri
    this.options = Object.assign({}, dbOptions)
    this.settings = {}

    if (typeof dbSettings === 'object') {
      this.applySettings(dbSettings)
    }
  }

  /**
   * Configures mongoose settings.
   */
  applySettings (settings) {
    Object.assign(this.settings, settings)

    for (const setting in settings) {
      if (Object.hasOwnProperty.call(settings, setting)) {
        mongoose.set(setting, settings[setting])
      }
    }
  }

  /**
   * The following methods
   * are event listeners
   * for every mongoose event.
   */
  onConnecting () {
    console.log(`MongoDB: connecting to: '${this.uri}'`)
    console.log(`MongoDB: with options: ${JSON.stringify(this.options)}`)
    console.log(`MongoDB: and settings: ${JSON.stringify(this.settings)}`)
  }

  onConnected () {
    console.log('MongoDB: connected!')
  }

  onDisconnecting () {
    console.log('MongoDB: disconnecting...')
  }

  onDisconnected () {
    console.log('MongoDB: disconnected!')
  }

  onReconnected () {
    console.log('MongoDB: reconnected!')
  }

  onReconnectFailed () {
    console.error('MongoDB: reconnection failed!')
    console.log('MongoDB: terminating the app...')
    process.exit(1)
  }

  onClose () {
    console.log('MongoDB: connection closed!')
  }

  onError (err) {
    console.error(`MongoDB: error: ${String(err)}`)
  }

  /**
   * Resolves the connection promise and
   * registers mongoose events listeners
   * when connection is successful.
   * Finally, sets 'dbConnection'
   * to use it as a singleton.
   * @param {function} resolve Resolver function
   */
  onConnectionSuccess (resolve) {
    mongooseConnection
      .on('disconnecting', this.onDisconnecting.bind(this))
      .on('disconnected', this.onDisconnected.bind(this))
      .on('reconnected', this.onReconnected.bind(this))
      .on('reconnectFailed', this.onReconnectFailed.bind(this))
      .on('close', this.onClose.bind(this))
      .on('error', this.onError.bind(this))

    dbConnection = mongooseConnection

    resolve(dbConnection)
  }

  /**
   * Rejects the connection promise
   * @param {function} reject Rejector function
   * @returns {function} Error handler function
   */
  onConnectionError (reject) {
    return function (err) {
      console.error(`MongoDB: Error while trying to connect: ${String(err)}`)
      reject(err)
    }
  }

  /**
   * Adds onConnecting and onConnected
   * events listeners
   */
  beforeConnection () {
    mongooseConnection
      .once('connecting', this.onConnecting.bind(this))
      .once('connected', this.onConnected.bind(this))
  }

  /**
   * Connects to the MongoDB server
   * @returns {Promise} That resolves with the dbConnection
   */
  connect () {
    if (dbConnection === null) {
      this.beforeConnection()

      return new Promise((resolve, reject) => {
        mongoose
          .connect(this.uri, this.options)
          .then(() => {
            return this.onConnectionSuccess(resolve)
          })
          .catch(this.onConnectionError(reject))
      })
    } else {
      return Promise.resolve(dbConnection)
    }
  }

  /**
   * Closes DB connection
   */
  close () {
    return mongooseConnection.close()
      .then(() => {
        dbConnection = null
        // remove all event listeners to prevent possible memory leaks
        return mongooseConnection.removeAllListeners()
      })
  }

  /**
   * Returns if the mongoose is connected to the DB.
   */
  isConnected () {
    return mongooseConnection.readyState === 1
  }
}

module.exports = MongoDBConnection
