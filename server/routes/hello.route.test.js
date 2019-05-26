const expect = require('chai').expect
const httpMocks = require('node-mocks-http')
const sinon = require('sinon')

const HelloRoute = require('./hello.route')

describe('Hello Route - Unit Tests', () => {
  it('should return Hello World #sanity', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    })
    const res = httpMocks.createResponse()
    const spySend = sinon.spy(res, 'send')

    HelloRoute.handler(req, res)

    expect(res.statusCode).to.equal(200)
    expect(spySend.calledOnceWith(sinon.match('Hello World!'))).to.equal(true)
    expect(res._isEndCalled()).to.equal(true)
  })
})
