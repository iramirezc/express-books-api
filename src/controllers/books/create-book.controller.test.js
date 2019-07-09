const expect = require('chai').expect
const httpMocks = require('node-mocks-http')
const sinon = require('sinon')

const createBook = require('./create-book.controller')

describe('Create Book Controller - Unit Tests', () => {
  let req
  let res

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'POST',
      url: '/book'
    })

    res = httpMocks.createResponse()

    sinon.spy(res, 'json')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return a 201 status code', () => {
    createBook(req, res)

    expect(res.statusCode).to.equal(201)
    expect(res.finished).to.equal(true)
  })

  it('should return the book data', () => {
    createBook(req, res)

    sinon.assert.calledWith(res.json, {
      status: 'success',
      data: null
    })
  })
})
