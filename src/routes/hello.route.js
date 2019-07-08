class HelloRoute {
  static appendTo (server) {
    server.get('/', HelloRoute.handler)
  }

  static handler (req, res) {
    res.send('<h1>Hello World!</h1>')
  }
}

module.exports = HelloRoute
