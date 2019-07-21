const url = require('url')

/**
 * Freezes and object recursively
 * Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 * @param {object} object Objected to Freeze
 */
function deepFreeze (object) {
  // Retrieve the property names defined on object
  var propNames = Object.getOwnPropertyNames(object)
  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name]

    if (typeof value === 'object') {
      object[name] = deepFreeze(value)
    } else {
      object[name] = value
    }
  }

  return Object.freeze(object)
}

/**
 * Formats the MongoDB URI
 * @param {object} mongoDBConfig MongoDB config object
 * @param {string} mongoDBConfig.host MongoDB host
 * @param {string} mongoDBConfig.port MongoDB port
 * @param {string} mongoDBConfig.name MongoDB database name
 * @returns (string) An URI like: 'mongodb://express-books-db:27017/books'
 */
function formatMongoDBStringURI ({ host, port, name }) {
  return url.format({
    protocol: 'mongodb',
    slashes: true,
    hostname: host,
    port: port,
    pathname: name
  })
}

/**
 * Normalizes a Port
 * @returns (string|number|boolean)
 */
function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val // named pipe
  }

  if (port >= 0) {
    return port // port number
  }

  return false
}

/**
 * Parses a string value to a boolean.
 * If value is cannot be converted
 * returns the _default value.
 * @param {*} val Value to be parsed
 * @param {boolean} _default Defaults to false
 */
function parseBoolean (val, _default = false) {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val.toLowerCase() === 'true'
  return _default
}

/**
 * Calls a callback function when NODE_ENV matches to env provided.
 * @param {string} env Name of environment
 * @param {function} cb Callback function
 */
function whenEnv (env, cb) {
  if (process.env.NODE_ENV === env && typeof cb === 'function') cb()
}

module.exports = {
  deepFreeze,
  formatMongoDBStringURI,
  normalizePort,
  parseBoolean,
  whenEnv
}
