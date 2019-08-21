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

  static getBookById (req, res) {
    return Promise.resolve()
      .then(() => {
        return res.status(200).json({
          status: 'success',
          data: req._book
        })
      })
      .catch(err => {
        return res.status(500).json({
          status: 'fail',
          message: String(err)
        })
      })
  }

  static updateBookById (req, res) {
    const { bookId } = req.params

    return BookService.getInstance().updateBookById(bookId, req.body)
      .then(book => {
        return res.status(200).json({
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

  static deleteBookById (req, res) {
    const { bookId } = req.params

    return BookService.getInstance().deleteBookById(bookId)
      .then(deletedBook => {
        return res.status(200).json({
          status: 'success',
          data: deletedBook
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
