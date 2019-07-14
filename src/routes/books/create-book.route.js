const { BooksController } = require('../../controllers')

module.exports = server => {
  server.post('/book', BooksController.createBook)
}
