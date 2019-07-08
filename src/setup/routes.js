const { sync } = require('glob')

function install (server) {
  const routes = sync('../routes/*.route.js', { cwd: __dirname })

  routes.forEach(route => {
    console.log(`Appending route: ${route}`)
    require(route).appendTo(server)
  })
}

module.exports = install
