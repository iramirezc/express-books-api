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

  static getAllBooks (req, res) {
    return BookService.getInstance().getAllBooks()
      .then(books => {
        return res.status(200).json({
          status: 'success',
          data: books
        })
      })
      .catch(err => {
        return res.status(500).json({
          status: 'fail',
          message: String(err)
        })
      })
  }
}

module.exports = BooksController
