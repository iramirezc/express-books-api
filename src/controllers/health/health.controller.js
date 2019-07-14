class HealthController {
  static getHealth(req, res) {
    return res.status(200).json({
      status: 'success'
    })
  }
}

module.exports = HealthController
