const expect = require('chai').expect
const httpMocks = require('node-mocks-http')
const sinon = require('sinon')

const getHealth = require('./health.controller')

describe('Health Controller - Unit Tests', () => {
  let req
  let res

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    })

    res = httpMocks.createResponse()

    sinon.spy(res, 'json')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return a 200 status code', () => {
    getHealth(req, res)

    expect(res.statusCode).to.equal(200)
    expect(res.finished).to.equal(true)
  })

  it('should return success status', () => {
    getHealth(req, res)

    sinon.assert.calledWith(res.json, { status: 'success' })
    expect(res.finished).to.equal(true)
  })
})
