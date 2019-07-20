const { expect, sinon, tools } = require('../../test')
const { MockFactory, BookModelMock } = require('../../test/mocks')
const { BookService } = require('../../services')
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
      const response = MockFactory.createHttpResponse()

      sinon.stub(BookService.getInstance(), 'createBook').resolves(BookModelMock.create(bookData))
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

          expect(BookService.getInstance().getAllBooks).to.have.been.calledOnce // eslint-disable-line
          expect(response.json).to.have.been.calledWithMatch({
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

          expect(BookService.getInstance().getAllBooks).to.have.been.calledOnce // eslint-disable-line
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake service getAllBooks error.'
          })
          done()
        })
        .catch(done)
    })
  })
})
