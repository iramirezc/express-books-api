const { expect, sinon, tools } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const { BookModel } = require('../../models')
const BooksController = require('./books.controller')

describe('Book Controller - Unit Tests', () => {
  let reqOptions

  afterEach(() => {
    sinon.restore()
    tools.deleteMongooseModels()
  })

  describe('createBook - static method', () => {
    before(() => {
      reqOptions = {
        method: 'POST',
        url: '/book'
      }
    })

    it('should respond with a 201 status code and return the new book', done => {
      const bookData = MockFactory.createBook()
      const request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      const response = MockFactory.createHttpResponse({})

      sinon.stub(BookService.getInstance(), 'createBook').resolves(new BookModel(bookData))
      sinon.spy(response, 'json')

      BooksController.createBook(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(201)
          expect(response.finished).to.equal(true)

          expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWithMatch({
            status: 'success',
            data: {
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
            }
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 400 status code and the error message', done => {
      const bookData = MockFactory.createBook()
      const request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      const response = MockFactory.createHttpResponse({})

      sinon.stub(BookService.getInstance(), 'createBook').rejects('Fake service error.')
      sinon.spy(response, 'json')

      BooksController.createBook(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(400)
          expect(response.finished).to.equal(true)

          expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake service error.'
          })
          done()
        })
        .catch(done)
    })
  })
})
