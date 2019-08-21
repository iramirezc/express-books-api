const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const BooksController = require('./books.controller')

describe('Books Controller - Unit Tests', () => {
  describe('createBook - static method', () => {
    let reqOptions

    before(() => {
      reqOptions = {
        method: 'POST',
        url: '/books'
      }
    })

    it('should respond with a 201 status code and return the new book', done => {
      const bookData = MockFactory.createBook()
      const expectedBook = MockFactory.createBook(bookData).toDocument()
      const request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'createBook').resolves(expectedBook)
      sinon.spy(response, 'json')

      BooksController.createBook(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(201)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: expectedBook
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 400 status code and the error message', done => {
      const bookData = MockFactory.createBook()
      const request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      const response = MockFactory.createHttpResponse()

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

  describe('getAllBooks - static method', () => {
    let reqOptions

    before(() => {
      reqOptions = {
        method: 'GET',
        url: '/books'
      }
    })

    it('should respond with a 200 status code and return all the books', done => {
      const expectedBooks = MockFactory.createRandomBooks(10).map(book => book.toDocument())
      const request = MockFactory.createHttpRequest(reqOptions)
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getAllBooks').resolves(expectedBooks)
      sinon.spy(response, 'json')

      BooksController.getAllBooks(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(200)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().getAllBooks).to.have.been.calledWith()
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: expectedBooks
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 500 status code and the error message', done => {
      const request = MockFactory.createHttpRequest(reqOptions)
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'getAllBooks').rejects('Fake service getAllBooks error.')
      sinon.spy(response, 'json')

      BooksController.getAllBooks(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(500)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().getAllBooks).to.have.been.calledWith()
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake service getAllBooks error.'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('getBookById - static method', () => {
    const createReqObj = bookId => ({
      method: 'GET',
      url: `/books/${bookId}`,
      params: { bookId }
    })

    it('should respond with a 200 status code and return the book found', done => {
      const expectedBook = MockFactory.createBook().toDocument()
      const request = MockFactory.createHttpRequest(createReqObj(expectedBook._id))
      const response = MockFactory.createHttpResponse()

      sinon.spy(response, 'json')

      Object.assign(request, { _book: expectedBook }) // put the book object like the middleware

      BooksController.getBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(200)
          expect(response.finished).to.equal(true)
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: expectedBook
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 500 status code and the error message', done => {
      const request = MockFactory.createHttpRequest()
      const response = MockFactory.createHttpResponse()

      sinon.stub(response, 'json').onFirstCall().throws('Fake response json error.')

      BooksController.getBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(500)
          expect(response.finished).to.equal(false)
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake response json error.'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('updateBookById - static method', () => {
    const createReqObj = (bookId, body) => ({
      method: 'PUT',
      url: `/books/${bookId}`,
      params: { bookId },
      body
    })

    it('should respond with a 200 status code and return the book updated', done => {
      const bookId = MockFactory.createMongoId()
      const expectedBook = MockFactory.createBook({ _id: bookId }).toDocument()
      const newBookData = MockFactory.createBook()
      const request = MockFactory.createHttpRequest(createReqObj(bookId, newBookData))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'updateBookById').resolves(expectedBook)
      sinon.spy(response, 'json')

      BooksController.updateBookById(request, response, null, bookId)
        .then(() => {
          expect(response.statusCode).to.equal(200)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().updateBookById).to.have.been.calledWith(bookId, newBookData)
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: expectedBook
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 400 status code and the error message', done => {
      const request = MockFactory.createHttpRequest()
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'updateBookById').rejects('Fake service error.')
      sinon.spy(response, 'json')

      BooksController.updateBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(400)
          expect(response.finished).to.equal(true)
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake service error.'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('deleteBookById - static method', () => {
    const createReqObj = bookId => ({
      method: 'DELETE',
      url: `/books/${bookId}`,
      params: { bookId }
    })

    it('should respond with a 200 status code and return the deleted book', done => {
      const expectedBook = MockFactory.createBook().toDocument()
      const request = MockFactory.createHttpRequest(createReqObj(expectedBook._id))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'deleteBookById').resolves(expectedBook)
      sinon.spy(response, 'json')

      BooksController.deleteBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(200)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().deleteBookById).to.have.been.calledWith(expectedBook._id)
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: expectedBook
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 200 status code and return null when book is not found', done => {
      const bookId = MockFactory.createMongoId()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'deleteBookById').resolves(null)
      sinon.spy(response, 'json')

      BooksController.deleteBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(200)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().deleteBookById).to.have.been.calledWith(bookId)
          expect(response.json).to.have.been.calledWith({
            status: 'success',
            data: null
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a 500 status code and the error message', done => {
      const bookId = MockFactory.createMongoId()
      const request = MockFactory.createHttpRequest(createReqObj(bookId))
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'deleteBookById').rejects('Fake service error.')
      sinon.spy(response, 'json')

      BooksController.deleteBookById(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(500)
          expect(response.finished).to.equal(true)
          expect(BookService.getInstance().deleteBookById).to.have.been.calledWith(bookId)
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
