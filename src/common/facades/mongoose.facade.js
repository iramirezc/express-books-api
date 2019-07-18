const mongoose = require('mongoose')
const mongooseConnection = mongoose.connection // mongoose default connection

const { whenEnv } = require('../utils')

// dbConnection will eventually be the same as
// the mongoose.connection after initial connection
let dbConnection = null

class MongoDBConnection {
  /**
   * @param {string} dbUri MongoDB URI string
   * @param {object} dbOptions MongoDB Options
   */
  constructor (dbUri, dbOptions) {
    this.uri = dbUri
    this.options = Object.assign({}, dbOptions)
  }

  /**
   * Updates the db uri
   * @param {string} newUri
   */
  setUri (newUri) {
    this.uri = newUri
  }

  /**
   * Appends a key:val to the config object
   * @param {string} prop Property's name
   * @param {*} val Value for the new prop
   */
  addToConfig (prop, val) {
    Object.assign(this.options, { [prop]: val })
  }

  /**
   * Configures mongoose,
   * the 'uri' and the 'config' object
   * depending on the environment.
   */
  beforeConnection () {
    whenEnv('test', () => {
      this.setUri(`${this.uri}-test`) // append `test` to db name
    })

    whenEnv('development', () => {
      // All executed collection methods
      // will log output of their arguments
      // to the console.
      mongoose.set('debug', true)
      this.setUri(`${this.uri}-dev`) // append `dev` to db name
    })

    whenEnv('production', () => {
      // Disable default mongoose buffer
      // and fail when connection is disconnected.
      mongoose.set('bufferCommands', false)
      // index builds can cause performance degradation
      // for large production deployments.
      this.addToConfig('autoIndex', false)
    })
  }

  /**
   * The following methods
   * are event listeners
   * for mongoose events.
   */
  onConnecting () {
    console.log(`MongoDB: connecting to: '${this.uri}'`)
    console.log(`MongoDB: with options: ${JSON.stringify(this.options)}`)
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
    console.log('MongoDB: terminating the app')
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
    mongooseConnection.on('disconnecting', this.onDisconnecting.bind(this))
    mongooseConnection.on('disconnected', this.onDisconnected.bind(this))
    mongooseConnection.on('reconnected', this.onReconnected.bind(this))
    mongooseConnection.on('reconnectFailed', this.onReconnectFailed.bind(this))
    mongooseConnection.on('close', this.onClose.bind(this))
    mongooseConnection.on('error', this.onError.bind(this))

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
   * Connects to the MongoDB server
   * @returns {Promise} That resolves with the dbConnection
   */
  connect () {
    if (dbConnection === null) {
      this.beforeConnection()

      mongooseConnection.on('connecting', this.onConnecting.bind(this))
      mongooseConnection.on('connected', this.onConnected.bind(this))

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
    console.log('MongoDB: closing connection...')
    dbConnection = null
    return mongooseConnection.close()
  }

  /**
   * Returns if the mongoose is connected to the DB.
   */
  isConnected () {
    return mongooseConnection.readyState === 1
  }
}

module.exports = MongoDBConnection
