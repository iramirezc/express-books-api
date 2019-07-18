const db = require('../../config/db')

class HealthController {
  static getHealth (req, res) {
    if (!db.isConnected()) {
      return res.status(500).json({
        status: 'fail',
        message: 'DB disconnected!'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: {
        api: true,
        db: true
      }
    })
  }
}

module.exports = HealthController
