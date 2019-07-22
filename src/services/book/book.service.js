const { BookModel } = require('../../models')

let instance = null

class BookService {
  constructor ({ BookModel }) {
    this.BookModel = BookModel
  }

  static getInstance () {
    if (instance === null) {
      instance = new BookService({ BookModel })
    }
    return instance
  }

  createBook ({
    title,
    authors,
    pages,
    isbn,
    publisher,
    publicationDate,
    edition
  }) {
    return this.BookModel.create({
      title,
      authors,
      pages,
      isbn,
      publisher,
      publicationDate,
      edition
    })
  }

  getAllBooks () {
    return this.BookModel.find({})
  }

  getBookById (bookId) {
    return this.BookModel.findById(bookId)
  }
}

module.exports = BookService
