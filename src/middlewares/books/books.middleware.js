const { BookService } = require('../../services')

class BooksMiddleware {
  static findBookById (req, res, next, bookId) {
    return BookService.getInstance().getBookById(bookId)
      .then(book => {
        if (!book) {
          return res.status(404).json({
            status: 'fail',
            message: `bookId '${bookId}' not found.`
          })
        }

        req._book = book

        next()
      })
      .catch(next)
  }
}

module.exports = BooksMiddleware
