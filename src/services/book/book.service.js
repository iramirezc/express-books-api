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

  static fromPayload ({
    title,
    authors,
    pages,
    isbn,
    publisher,
    publicationDate,
    edition
  }) {
    return {
      title,
      authors,
      pages,
      isbn,
      publisher,
      publicationDate,
      edition
    }
  }

  createBook (payload) {
    return this.BookModel.create(BookService.fromPayload(payload))
  }

  getAllBooks () {
    return this.BookModel.find({})
  }

  getBookById (bookId) {
    return this.BookModel.findById(bookId)
  }

  validatePayload (payload) {
    const { BookModel } = this
    const tempBook = new BookModel(BookService.fromPayload(payload))

    return tempBook.validate()
  }

  updateBookById (bookId, newBookData) {
    const updates = Object.assign(BookService.fromPayload(newBookData), { updatedAt: Date.now() + 1 })

    return this.BookModel.findByIdAndUpdate(bookId, updates)
      .setOptions({ new: true, omitUndefined: true, runValidators: true })
      .exec()
  }
}

module.exports = BookService
