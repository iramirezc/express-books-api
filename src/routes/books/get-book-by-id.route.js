const express = require('express')

const { BooksController } = require('../../controllers')
const { BooksMiddleware } = require('../../middlewares')

module.exports = server => {
  const router = express.Router()

  router.get('/books/:bookId', BooksController.getBookById)

  router.param('bookId', BooksMiddleware.findBookById)

  server.use(router)
}
