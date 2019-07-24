const { sync } = require('glob')
const { basename } = require('path')

module.exports = () => {
  const paths = sync('../models/**/*.model.js', { cwd: __dirname })

  paths.forEach(path => {
    console.log(`Mongoose: requiring: ${basename(path)}`)
    require(path)
  })
}
