const { BookService } = require('../../services')

class BooksMiddleware {
  static findBookById (req, res, next) {
    const { bookId } = req.params

    return BookService.getInstance().getBookById(bookId)
      .then(book => {
        req._book = book
        next()
      })
      .catch(next)
  }
}

module.exports = BooksMiddleware
