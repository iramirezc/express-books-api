const chai = require('chai')
const expect = chai.expect
const httpMocks = require('node-mocks-http')
const sinon = require('sinon')
const { Types: { ObjectId } } = require('mongoose')

const Book = require('../../models/book')
const createBook = require('./create-book.controller')
const { buildBook } = require('../../test/helpers/book.mocks')

chai.use(require('sinon-chai'))

describe('Create Book Controller - Unit Tests', () => {
  let reqOptions
  let request
  let response
  let bookData

  beforeEach(() => {
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
      bookData = buildBook()
      sinon.stub(Book, 'create').resolves(new Book(bookData))
      request = httpMocks.createRequest({ body: bookData, ...reqOptions })
      response = httpMocks.createResponse({})
      sinon.spy(response, 'json')

      return createBook(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(201)
          expect(response.finished).to.equal(true)

          expect(Book.create).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWithMatch({
            status: 'success',
            data: Object.assign(bookData, {
              _id: sinon.match.instanceOf(ObjectId),
              authors: sinon.match.array.deepEquals(bookData.authors),
              createdAt: sinon.match.date,
              updatedAt: sinon.match.date
            })
          })
        })
    })
  })

  describe('error handling', () => {
    it('should respond with a 400 status code and the error message', () => {
      bookData = buildBook()
      sinon.stub(Book, 'create').rejects('Fake validation error.')
      request = httpMocks.createRequest({ body: bookData, ...reqOptions })
      response = httpMocks.createResponse({})
      sinon.spy(response, 'json')

      return createBook(request, response)
        .then(() => {
          expect(response.statusCode).to.equal(400)
          expect(response.finished).to.equal(true)

          expect(Book.create).to.have.been.calledWith(bookData)
          expect(response.json).to.have.been.calledWithMatch({
            status: 'fail',
            message: 'Fake validation error.'
          })
        })
    })
  })
})
