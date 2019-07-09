const { health } = require('../../controllers/health')

module.exports = server => {
  server.get('/health', health)
}
