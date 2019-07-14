const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const HealthController = require('./health.controller')

describe('Health Controller - Unit Tests', () => {
  let reqOptions

  afterEach(() => {
    sinon.restore()
  })

  describe('getHealth - static method', () => {
    before(() => {
      reqOptions = {
        method: 'GET',
        url: '/health'
      }
    })

    it('should respond with a 200 status code and a message of success', () => {
      const request = MockFactory.createHttpRequest(reqOptions)
      const response = MockFactory.createHttpResponse()

      sinon.spy(response, 'json')

      HealthController.getHealth(request, response)

      expect(response.statusCode).to.equal(200)
      expect(response.finished).to.equal(true)
      expect(response.json).to.have.been.calledWith({
        status: 'success',
      })
    })
  })
})
