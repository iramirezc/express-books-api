const mongoose = require('mongoose')
const { expect, sinon, utils } = require('../../test')
const MongooseDBConnector = require('./mongoose.facade')

describe('Mongoose Facade - Unit Tests', () => {
  let uri
  let options

  beforeEach(() => {
    uri = 'mongodb://my-host:27017/my-db'
    options = { autoIndex: true }
    // prevents possible memory leak on event listeners
    sinon.stub(mongoose.connection, 'on').returns()
    sinon.stub(mongoose.connection, 'close').resolves()
  })

  afterEach(() => {
    sinon.restore()
    utils.deleteMongooseModels()
  })

  describe('initialization', () => {
    it('should create a new instance of MongooseDBConnector', () => {
      const db = new MongooseDBConnector(uri, options)

      expect(db.uri).to.equal(uri)
      expect(db.options).to.deep.equal(options)
    })

    it('should expose only its public props', () => {
      const db = new MongooseDBConnector(uri, options)
      const methods = Object.keys(db)

      expect(methods).to.deep.equal(['uri', 'options'])
    })
  })

  describe('setUri - method', () => {
    it('should update the uri', () => {
      const db = new MongooseDBConnector(uri, options)
      const newUri = 'any-other-string'

      db.setUri(newUri)

      expect(db.uri).to.equal(newUri)
    })
  })

  describe('addToConfig - method', () => {
    it('should add a new prop to the options without altering the originals', () => {
      const db = new MongooseDBConnector(uri, options)
      const expectedProps = Object.assign({}, options, { destroy: false })

      db.addToConfig('destroy', false)
      expect(db.options).not.to.deep.equal(options)
      expect(db.options).to.deep.equal(expectedProps)
    })
  })

  describe('close - method', () => {
    it('should call native method from mongoose connection', done => {
      const db = new MongooseDBConnector(uri, options)

      db
        .close()
        .then(() => {
          expect(mongoose.connection.close).to.have.been.calledOnce // eslint-disable-line
          done()
        })
        .catch(done)
    })
  })

  describe('connect - method', () => {
    it('should return the mongoose connection on the first call', done => {
      const db = new MongooseDBConnector(uri, options)

      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(db, 'connect')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')

      db
        .connect()
        .then(connection => {
          expect(db.connect).to.have.been.calledOnce // eslint-disable-line
          expect(db.beforeConnection).to.have.been.calledOnce // eslint-disable-line
          expect(db.onConnectionSuccess).to.have.been.calledOnce // eslint-disable-line
          expect(connection).to.equal(mongoose.connection)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })

    it('should return the same connection on the second call', done => {
      const db = new MongooseDBConnector(uri, options)

      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(db, 'connect')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')

      db.connect()
        .then(connection => {
          expect(connection).to.equal(mongoose.connection)
          // make second call
          return db.connect()
        })
        .then(connection => {
          expect(db.connect).to.have.been.calledTwice // eslint-disable-line
          expect(db.beforeConnection).to.have.been.calledOnce // eslint-disable-line
          expect(db.onConnectionSuccess).to.have.been.calledOnce // eslint-disable-line
          expect(connection).to.equal(mongoose.connection)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })

    it('should reject if an error occurs', done => {
      const db = new MongooseDBConnector(uri, options)

      sinon.stub(mongoose, 'connect').rejects('Fake mongoose error')
      sinon.spy(db, 'connect')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')
      sinon.spy(db, 'onConnectionError')

      db.connect()
        .then(() => {
          done(new Error('mongoose.connect was supposed to fail'))
        })
        .catch(err => {
          expect(db.connect).to.have.been.calledOnce // eslint-disable-line
          expect(db.beforeConnection).to.have.been.calledOnce // eslint-disable-line
          expect(db.onConnectionSuccess).to.not.have.been.called // eslint-disable-line
          expect(db.onConnectionError).to.have.been.calledOnce // eslint-disable-line
          expect(err).to.match(/Fake mongoose error/)
          done()
        })
        .catch(done)
    })
  })
})
