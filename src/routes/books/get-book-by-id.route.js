const express = require('express')

const { BooksController } = require('../../controllers')

module.exports = server => {
  const router = express.Router()

  router.get('/books/:bookId', BooksController.getBookById)

  router.param('bookId', BooksController.findBookById)

  server.use(router)
}
