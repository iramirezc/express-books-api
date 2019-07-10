const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { Book } = require('../../models')
const createBookController = require('./create-book.controller')

describe('Create Book Controller - Unit Tests', () => {
  let reqOptions
  let request
  let response
  let bookData

  before(() => {
    reqOptions = {
      method: 'POST',
      url: '/book'
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('success cases', () => {
    it('should respond with a 201 status code and return the new book', () => {
      bookData = MockFactory.createBook()
      request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      response = MockFactory.createHttpResponse({})

      sinon.stub(Book, 'create').resolves(new Book(bookData))
      sinon.spy(response, 'json')

      return createBookController(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(201)
          expect(response.finished).to.equal(true)

          expect(Book.create).to.have.been.calledWith(bookData)
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
        })
    })
  })

  describe('error handling', () => {
    it('should respond with a 400 status code and the error message', () => {
      bookData = MockFactory.createBook()
      request = MockFactory.createHttpRequest({ body: bookData, ...reqOptions })
      response = MockFactory.createHttpResponse({})

      sinon.stub(Book, 'create').rejects('Fake validation error.')
      sinon.spy(response, 'json')

      return createBookController(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(400)
          expect(response.finished).to.equal(true)

          expect(Book.create).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWith({
            status: 'fail',
            message: 'Fake validation error.'
          })
        })
    })
  })
})
