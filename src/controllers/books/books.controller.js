const { BookService } = require('../../services')

class BooksController {
  static createBook (req, res) {
    return BookService.getInstance().createBook(req.body)
      .then(book => {
        return res.status(201).json({
          status: 'success',
          data: book
        })
      })
      .catch(err => {
        return res.status(400).json({
          status: 'fail',
          message: String(err)
        })
      })
  }
}

module.exports = BooksController
