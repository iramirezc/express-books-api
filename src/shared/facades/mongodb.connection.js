const mongoose = require('mongoose')
const mongooseConnection = mongoose.connection // mongoose default connection

const logger = require('../../services').LoggerService.get('MongoDB', { level: 'info' })

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
    logger.info(`connecting to: '${this.uri}'`)
    logger.debug('with options:', this.options)
    logger.debug('and settings:', this.settings)
  }

  onConnected () {
    logger.info('connected!')
  }

  onDisconnecting () {
    logger.warn('disconnecting...')
  }

  onDisconnected () {
    logger.warn('disconnected!')
  }

  onReconnected () {
    logger.info('reconnected!')
  }

  onReconnectFailed () {
    logger.error('reconnection failed!')
    process.exit(1)
  }

  onClose () {
    logger.info('connection closed!')
  }

  onError (err) {
    logger.error(`error: ${String(err)}`)
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
      logger.error(`error while trying to connect: ${String(err)}`)
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
