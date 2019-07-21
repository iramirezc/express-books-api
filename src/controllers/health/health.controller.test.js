const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const HealthController = require('./health.controller')
const db = require('../../config/db')

describe('Health Controller - Unit Tests', () => {
  let reqOptions

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

      sinon.stub(db, 'isConnected').returns(true)
      sinon.spy(response, 'json')

      HealthController.getHealth(request, response)

      expect(response.statusCode).to.equal(200)
      expect(response.finished).to.equal(true)
      expect(response.json).to.have.been.calledWith({
        status: 'success',
        data: {
          api: true,
          db: true
        }
      })
    })

    it('should respond with a 500 status code and a message with the reason of failure', () => {
      const request = MockFactory.createHttpRequest(reqOptions)
      const response = MockFactory.createHttpResponse()

      sinon.stub(db, 'isConnected').returns(false)
      sinon.spy(response, 'json')

      HealthController.getHealth(request, response)

      expect(response.statusCode).to.equal(500)
      expect(response.finished).to.equal(true)
      expect(response.json).to.have.been.calledWith({
        status: 'fail',
        message: 'DB disconnected!'
      })
    })
  })
})
