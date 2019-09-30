const { sync } = require('glob')
const { basename } = require('path')

const logger = require('../services').LoggerService.get('Models')

module.exports = () => {
  const paths = sync('../models/**/*.model.js', { cwd: __dirname })

  paths.forEach(path => {
    logger.debug(`requiring: ${basename(path)}`)
    require(path)
  })
}
