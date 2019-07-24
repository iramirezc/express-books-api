const { sync } = require('glob')
const { basename } = require('path')

module.exports = server => {
  const paths = sync('../routes/**/*.routes.js', { cwd: __dirname })

  paths.forEach(path => {
    console.log(`Express: requiring: ${basename(path)}`)
    const router = require(path)
    server.use(router())
  })
}
