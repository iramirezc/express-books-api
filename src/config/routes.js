const { sync } = require('glob')
const { basename } = require('path')

const logger = require('../services').LoggerService.get('Routes')

module.exports = server => {
  const paths = sync('../routes/**/*.routes.js', { cwd: __dirname })

  paths.forEach(path => {
    logger.debug(`requiring: ${basename(path)}`)
    const router = require(path)
    server.use(router())
  })
}
