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
      const expectedBook = MockFactory.createBook().toDocument()
      const request = MockFactory.createHttpRequest(createReqObj(expectedBook._id))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(expectedBook)

      BooksMiddleware.findBookById(request, response, next)
        .then(() => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(expectedBook._id)
          expect(response.finished).to.equal(false)
          expect(request._book).to.equals(expectedBook)
          expect(next).to.have.been.calledWith()
          done()
        })
        .catch(done)
    })

    it('should call next function with an error if something goes wrong', done => {
      const bookId = MockFactory.createMongoId()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getBookById').rejects('Fake service getBookById error')

      BooksMiddleware.findBookById(request, response, next)
        .then(() => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(bookId)
          expect(response.finished).to.equal(false)
          expect(request._book).to.be.undefined // eslint-disable-line
          expect(next.getCall(0).args[0]).to.match(/Fake service getBookById error/)
          done()
        })
        .catch(done)
    })
  })
})
