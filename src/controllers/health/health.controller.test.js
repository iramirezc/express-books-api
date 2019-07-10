const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const getHealthController = require('./health.controller')

describe('Health Controller - Unit Tests', () => {
  let reqOptions
  let request
  let response

  before(() => {
    reqOptions = {
      method: 'GET',
      url: '/health'
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return a 200 status code', () => {
    request = MockFactory.createHttpRequest(reqOptions)
    response = MockFactory.createHttpResponse()

    sinon.spy(response, 'json')
    
    getHealthController(request, response)
    expect(response.statusCode).to.equal(200)
    expect(response.finished).to.equal(true)
  })

  it('should return success status', () => {
    request = MockFactory.createHttpRequest(reqOptions)
    response = MockFactory.createHttpResponse()

    sinon.spy(response, 'json')

    getHealthController(request, response)
    expect(response.json).to.have.been.calledWith({ status: 'success' })
    expect(response.finished).to.equal(true)
  })
})
