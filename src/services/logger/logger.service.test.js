const { expect, sinon } = require('../../test')
const LoggerService = require('./logger.service')

describe('Logger Service - Unit Tests', () => {
  describe('customFormat', () => {
    it('should be a function', () => {
      expect(LoggerService.customFormat).to.be.a('function')
    })

    it('should format an info object correctly with meta-data', () => {
      const expected = /^.+ info TestLogger: hello world {"data":true,"number":1}$/
      const info = {
        timestamp: new Date().toJSON(),
        level: 'info',
        label: 'TestLogger',
        message: 'hello world',
        data: true,
        number: 1
      }
      expect(LoggerService.customFormat(info)).to.match(expected)
    })

    it('should format a message as JSON when is an object', () => {
      const expected = /^.+ debug Logger: {"data":true,"number":1}$/
      const info = {
        timestamp: new Date().toJSON(),
        level: 'debug',
        label: 'Logger',
        message: {
          data: true,
          number: 1
        }
      }
      expect(LoggerService.customFormat(info)).to.match(expected)
    })
  })

  describe('add & get methods', () => {
    it('should be a function', () => {
      expect(LoggerService.add).to.be.a('function')
      expect(LoggerService.get).to.be.a('function')
    })

    it('should create a logger if it does not exists', () => {
      sinon.spy(LoggerService, 'add')

      const logger = LoggerService.get('MyLogger')

      sinon.spy(logger, 'info')

      logger.info('hello')

      expect(LoggerService.add).to.have.been.calledOnceWith('MyLogger')
      expect(logger.info).to.have.been.calledOnceWith('hello')
    })

    it('should return the same logger when is already created', () => {
      LoggerService.add('MongoDBLogger')

      sinon.spy(LoggerService, 'add')

      const logger1 = LoggerService.get('MongoDBLogger')

      logger1.info({ data: true })

      const logger2 = LoggerService.get('MongoDBLogger')

      logger2.error(new Error('Some fake error'))

      expect(LoggerService.add).to.have.been.callCount(0)
      expect(logger1).to.equal(logger2)
    })
  })
})
