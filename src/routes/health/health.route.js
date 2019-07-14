const { HealthController } = require('../../controllers')

module.exports = server => {
  server.get('/health', HealthController.getHealth)
}
