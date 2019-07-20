const mongoose = require('mongoose')
const { expect, sinon, tools } = require('../../test')
const MongoDBConnection = require('./mongodb.connection')

describe('Mongoose DB Connection Facade - Unit Tests', () => {
  let uri
  let options
  let settings

  beforeEach(() => {
    uri = 'mongodb://my-host:27017/my-db'
    options = { useNewUrlParser: true, autoIndex: true }
    settings = { debug: true, bufferCommands: false }
  })

  afterEach(() => {
    sinon.restore()
    tools.deleteMongooseModels()
  })

  describe('initialization', () => {
    it('should create a new instance of MongoDBConnection', () => {
      const db = new MongoDBConnection(uri, options)

      expect(db.uri).to.equal(uri)
      expect(db.options).to.deep.equal(options)
    })

    it('should expose only its public props', () => {
      const db = new MongoDBConnection(uri, options, settings)
      const methods = Object.keys(db)

      expect(methods).to.deep.equal(['uri', 'options', 'settings'])
    })
  })

  describe('applySettings - method', () => {
    it('should call mongoose.set with the settings provided on initialization', () => {
      sinon.spy(mongoose, 'set')

      const db = new MongoDBConnection(uri, options, settings)

      expect(db.settings).to.deep.equal(settings)
      expect(mongoose.set).to.have.been.calledWith('debug', true)
      expect(mongoose.set).to.have.been.calledWith('bufferCommands', false)
    })
  })

  describe('close - method', () => {
    it('should call mongoose native method to close the connection', done => {
      const db = new MongoDBConnection(uri, options, settings)

      sinon.stub(mongoose.connection, 'removeAllListeners').resolves()
      sinon.stub(mongoose.connection, 'close').resolves()

      db
        .close()
        .then(() => {
          expect(mongoose.connection.removeAllListeners).to.have.been.calledOnce // eslint-disable-line
          expect(mongoose.connection.close).to.have.been.calledOnce // eslint-disable-line

          done()
        })
        .catch(done)
    })
  })

  describe('connect - method', () => {
    beforeEach(() => {
      sinon.stub(mongoose.connection, 'close').resolves()
    })

    it('should return the mongoose connection on the first call', done => {
      const db = new MongoDBConnection(uri, options, settings)

      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(db, 'connect')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')

      db
        .connect()
        .then(connection => {
          expect(mongoose.connect).to.have.been.calledOnce // eslint-disable-line
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
      const db = new MongoDBConnection(uri, options, settings)

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
          expect(mongoose.connect).to.have.been.calledOnce // eslint-disable-line
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
      const db = new MongoDBConnection(uri, options, settings)

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
          expect(mongoose.connect).to.have.been.calledOnce // eslint-disable-line
          expect(db.connect).to.have.been.calledOnce // eslint-disable-line
          expect(db.beforeConnection).to.have.been.calledOnce // eslint-disable-line
          expect(db.onConnectionSuccess).to.not.have.been.called // eslint-disable-line
          expect(db.onConnectionError).to.have.been.calledOnce // eslint-disable-line
          expect(err).to.match(/Fake mongoose error/)
          done()
        })
        .catch(done)
    })

    it('should attach the event listeners', done => {
      const db = new MongoDBConnection(uri, options, settings)

      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(mongoose.connection, 'on')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')

      db
        .connect()
        .then(() => {
          expect(mongoose.connection.on).to.have.been.calledAfter(db.beforeConnection)
          expect(mongoose.connection.on).to.have.been.calledWith('connecting')
          expect(mongoose.connection.on).to.have.been.calledWith('connected')
          expect(mongoose.connection.on).to.have.been.calledAfter(db.onConnectionSuccess)
          expect(mongoose.connection.on).to.have.been.calledWith('disconnecting')
          expect(mongoose.connection.on).to.have.been.calledWith('disconnected')
          expect(mongoose.connection.on).to.have.been.calledWith('reconnected')
          expect(mongoose.connection.on).to.have.been.calledWith('reconnectFailed')
          expect(mongoose.connection.on).to.have.been.calledWith('close')
          expect(mongoose.connection.on).to.have.been.calledWith('error')
          expect(mongoose.connection.on.callCount).to.equal(8)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })
  })
})
