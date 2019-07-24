const express = require('express')

const { HealthController } = require('../../controllers')

module.exports = () => {
  const router = express.Router()

  router
    .route('/health')
    .get(HealthController.getHealth)

  return router
}
