const { expect, sinon } = require('../../test')
const utils = require('./index')
const validators = require('./mongoose.validators')

describe('Shared Utils - Unit Tests', () => {
  describe('Generics', () => {
    describe('deepFreeze', () => {
      it('should deep freeze an object', () => {
        const config = {
          mongodb: {
            host: 'my-host',
            port: 271018,
            name: 'db-name',
            settings: {
              debug: true
            }
          }
        }

        utils.deepFreeze(config)

        // try to change the object
        config.server = {
          host: 'server',
          port: 3000
        }
        config.mongodb.host = 'mongo-db-host'
        config.mongodb.settings.debug = false

        expect(config).to.deep.equal({
          mongodb: {
            host: 'my-host',
            port: 271018,
            name: 'db-name',
            settings: {
              debug: true
            }
          }
        })
      })
    })

    describe('formatMongoDBStringURI', () => {
      it('should return a mongodb string URI', () => {
        expect(utils.formatMongoDBStringURI({
          host: 'my-db-host',
          port: 27019,
          name: 'my-db-name'
        })).to.equal('mongodb://my-db-host:27019/my-db-name')
      })
    })

    describe('normalizePort', () => {
      it('should return a number when port is a string', () => {
        expect(utils.normalizePort('8080')).to.equal(8080)
        expect(utils.normalizePort('3000')).to.equal(3000)
      })

      it('should return a the value as it is if it can not convert it to a number', () => {
        expect(utils.normalizePort('abc')).to.equal('abc')
        expect(utils.normalizePort(null)).to.equal(null)
      })

      it('should return false when the port number happens to be negative', () => {
        expect(utils.normalizePort('-80')).to.equal(false)
        expect(utils.normalizePort(-8080)).to.equal(false)
      })
    })

    describe('parseBoolean', () => {
      it('should return the same boolean value no matter the default', () => {
        expect(utils.parseBoolean(true, false)).to.equal(true)
        expect(utils.parseBoolean(false, true)).to.equal(false)
      })

      it('should parse a string to a boolean', () => {
        expect(utils.parseBoolean('false', true)).to.equal(false)
        expect(utils.parseBoolean('true', false)).to.equal(true)
        expect(utils.parseBoolean('other', true)).to.equal(false)
      })

      it('should return the default if value can not be converted', () => {
        expect(utils.parseBoolean(8080, 'default')).to.equal('default')
        expect(utils.parseBoolean(null, true)).to.equal(true)
        expect(utils.parseBoolean(null, false)).to.equal(false)
        expect(utils.parseBoolean(undefined, true)).to.equal(true)
        expect(utils.parseBoolean(undefined, false)).to.equal(false)
      })

      it('should return false if value can not be converted and default is not provided', () => {
        expect(utils.parseBoolean(123)).to.equals(false)
        expect(utils.parseBoolean(null)).to.equals(false)
      })
    })

    describe('whenEnv', () => {
      it('should call callback function when env matches', () => {
        const cb = sinon.spy()
        const env = 'testing'

        sinon.stub(process.env, 'NODE_ENV').value(env)

        utils.whenEnv(env, cb)

        expect(cb).to.have.been.calledOnce // eslint-disable-line
      })

      it('should not call callback function when env does not match', () => {
        const cb = sinon.spy()
        const env = 'testing'

        sinon.stub(process.env, 'NODE_ENV').value('other')

        utils.whenEnv(env, cb)

        expect(cb).not.to.have.been.calledOnce // eslint-disable-line
      })
    })
  })

  describe('Mongoose Validators', () => {
    describe('minLengthOf', () => {
      it('should return true when an array has the min length', () => {
        expect(validators.minLengthOf(0)([])).to.equal(true)
        expect(validators.minLengthOf(1)(['a'])).to.equal(true)
        expect(validators.minLengthOf(5)([1, '2', { data: 3 }, null, undefined, true])).to.equal(true)
      })

      it('should return false when an array does not have the min length', () => {
        expect(validators.minLengthOf(1)([])).to.equal(false)
        expect(validators.minLengthOf(2)(['a'])).to.equal(false)
        expect(validators.minLengthOf(7)([1, '2', { data: 3 }, null, undefined, true])).to.equal(false)
      })
    })
  })
})
