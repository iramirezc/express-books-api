const express = require('express')

const { BooksController } = require('../../../../controllers')
const { BooksMiddleware } = require('../../../../middlewares')

module.exports = () => {
  const router = express.Router()

  router.param('bookId', BooksMiddleware.findBookById)

  router
    .route('/api/v1/books')
    .post(BooksController.createBook)
    .get(BooksController.getAllBooks)

  router
    .route('/api/v1/books/:bookId')
    .get(BooksController.getBookById)
    .put(BooksController.updateBookById)

  return router
}
