const { sync } = require('glob')
const { basename } = require('path')

module.exports = server => {
  const paths = sync('../routes/**/*.route.js', { cwd: __dirname })

  paths.forEach(path => {
    console.log(`Express: adding route: ${basename(path)}`)
    require(path)(server)
  })
}
