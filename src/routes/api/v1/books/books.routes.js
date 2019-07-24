const express = require('express')

const { BooksController } = require('../../../../controllers')
const { BooksMiddleware } = require('../../../../middlewares')

module.exports = server => {
  const router = express.Router()

  router.post('/', BooksController.createBook)

  router.get('/', BooksController.getAllBooks)

  router.get('/:bookId', BooksController.getBookById)

  router.param('bookId', BooksMiddleware.findBookById)

  server.use('/api/v1/books', router)
}
