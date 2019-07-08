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

module.exports = {
  normalizePort
}
