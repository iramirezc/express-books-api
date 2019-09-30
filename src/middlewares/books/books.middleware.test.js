const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const BooksMiddleware = require('./books.middleware')

describe('Books Middleware - Unit Tests', () => {
  describe('findBookById - static method', () => {
    const createReqObj = bookId => ({
      method: 'GET',
      url: `/books/${bookId}`,
      params: { bookId }
    })

    let next

    beforeEach(() => {
      next = sinon.fake()
    })

    it('should attach the book to the req object if found and then call next middleware', done => {
      const bookId = MockFactory.createMongoId()
      const expectedBook = MockFactory.createBook({ _id: bookId }).toDocument()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(expectedBook)

      BooksMiddleware.findBookById(request, response, next, bookId)
        .then(() => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(bookId)
          expect(response.finished).to.equal(false)
          expect(request._book).to.equals(expectedBook)
          expect(next).to.have.been.calledWith()
          done()
        })
        .catch(done)
    })

    it('should respond with a 404 status code if the book is not found', done => {
      const bookId = MockFactory.createMongoId()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.spy(response, 'json')

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(null)

      BooksMiddleware.findBookById(request, response, next, bookId)
        .then(() => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(bookId)
          expect(response.statusCode).to.equal(404)
          expect(response.finished).to.equal(true)
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: `bookId '${bookId}' not found.`
          })
          expect(next).to.have.been.callCount(0)
          done()
        })
        .catch(done)
    })

    it('should call next function with an error if something goes wrong', done => {
      const bookId = MockFactory.createMongoId()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getBookById').rejects('Fake service getBookById error')

      BooksMiddleware.findBookById(request, response, next, bookId)
        .then(() => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(bookId)
          expect(response.finished).to.equal(false)
          expect(request._book).to.equal(undefined)
          expect(next.getCall(0).args[0]).to.match(/Fake service getBookById error/)
          done()
        })
        .catch(done)
    })
  })
})
