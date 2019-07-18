const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookModel } = require('../../models')
const BookService = require('./book.service')

describe('Book Service - Unit Tests', () => {
  let service

  beforeEach(() => {
    service = new BookService({ BookModel })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('createBook - method', () => {
    it('should create a new book with the data provided', done => {
      const bookData = MockFactory.createBook()

      sinon.stub(BookModel, 'create').resolves(new BookModel(bookData))

      service.createBook(bookData)
        .then(book => {
          expect(BookModel.create).to.have.been.calledWith(bookData)
          sinon.assert.match(book, {
            _id: sinon.match.object,
            title: bookData.title,
            authors: sinon.match.array.deepEquals(bookData.authors),
            pages: bookData.pages,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publicationDate: bookData.publicationDate,
            edition: bookData.edition,
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
          })
          done()
        })
        .catch(done)
    })

    it('should return an error if something goes wrong', done => {
      const bookData = MockFactory.createBook()

      sinon.stub(BookModel, 'create').rejects('Fake validation error.')

      service.createBook(bookData)
        .then(() => {
          done(new Error('BookModel.create was not supposed to succeed.'))
        })
        .catch(err => {
          expect(BookModel.create).to.have.been.calledWith(bookData)
          expect(err).to.match(/Fake validation error/)
          done()
        })
        .catch(done)
    })
  })
})
