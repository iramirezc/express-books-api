const { BooksController } = require('../../controllers')

module.exports = server => {
  server.get('/books', BooksController.getAllBooks)
}
