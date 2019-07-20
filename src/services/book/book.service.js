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
}

module.exports = BookService
