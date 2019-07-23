const { BooksController } = require('../../controllers')

module.exports = server => {
  server.post('/books', BooksController.createBook)
}
