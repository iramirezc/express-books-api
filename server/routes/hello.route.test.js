const expect = require('chai').expect
const httpMocks = require('node-mocks-http')
const sinon = require('sinon')

const HelloRoute = require('./hello.route')

describe('Hello Route - Unit Tests', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('should return Hello World #sanity', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    })
    const res = httpMocks.createResponse()
    sinon.spy(res, 'send')

    HelloRoute.handler(req, res)

    expect(res.statusCode).to.equal(200)
    expect(res.finished).to.equal(true)
    sinon.assert.calledWith(res.send, sinon.match('Hello World'))
  })
})
