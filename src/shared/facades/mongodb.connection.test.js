const mongoose = require('mongoose')
const { expect, sinon } = require('../../test')
const MongoDBConnection = require('./mongodb.connection')

describe('Mongoose DB Connection Facade - Unit Tests', () => {
  let uri
  let options

  beforeEach(() => {
    uri = 'mongodb://my-host:27017/my-db'
    options = { useNewUrlParser: true, autoIndex: true }
  })

  describe('initialization', () => {
    it('should create a new instance of MongoDBConnection', () => {
      const db = new MongoDBConnection(uri, options)

      expect(db.uri).to.equal(uri)
      expect(db.options).to.deep.equal(options)
    })

    it('should expose only its public props', () => {
      const db = new MongoDBConnection(uri, options)
      const methods = Object.keys(db)

      expect(methods).to.deep.equal(['uri', 'options', 'settings'])
    })
  })

  describe('applySettings - method', () => {
    it('should call mongoose.set with the settings provided on initialization', () => {
      sinon.spy(mongoose, 'set')

      const settings = { debug: true, bufferCommands: false }
      const db = new MongoDBConnection(uri, options, settings)

      expect(db.settings).to.deep.equal(settings)
      expect(mongoose.set).to.have.been.calledWith('debug', true)
      expect(mongoose.set).to.have.been.calledWith('bufferCommands', false)
    })

    it('should apply only the settings that are direct properties of the object', () => {
      sinon.spy(mongoose, 'set')

      const protoSettings = { debug: true }
      const wrongSettings = Object.create(protoSettings)
      const db = new MongoDBConnection(uri, options, wrongSettings)

      expect(wrongSettings.debug).to.equal(true)
      expect(db.settings).to.deep.equal({})
      expect(mongoose.set).not.to.have.been.calledWith('debug', true)
    })

    it('should not apply settings if not provided', () => {
      sinon.spy(mongoose, 'set')

      const db = new MongoDBConnection(uri, options)

      expect(db.settings).to.deep.equal({})
      expect(mongoose.set).to.have.been.callCount(0)
    })
  })

  describe('close - method', () => {
    it('should call mongoose native method to close the connection', done => {
      const db = new MongoDBConnection(uri, options)

      sinon.stub(mongoose.connection, 'removeAllListeners').resolves()
      sinon.stub(mongoose.connection, 'close').resolves()

      db
        .close()
        .then(() => {
          expect(mongoose.connection.removeAllListeners).to.have.been.callCount(1)
          expect(mongoose.connection.close).to.have.been.callCount(1)

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
      const db = new MongoDBConnection(uri, options)

      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(db, 'connect')
      sinon.spy(db, 'beforeConnection')
      sinon.spy(db, 'onConnectionSuccess')

      db
        .connect()
        .then(connection => {
          expect(mongoose.connect).to.have.been.callCount(1)
          expect(db.connect).to.have.been.callCount(1)
          expect(db.beforeConnection).to.have.been.callCount(1)
          expect(db.onConnectionSuccess).to.have.been.callCount(1)
          expect(connection).to.equal(mongoose.connection)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })

    it('should return the same connection on the second call', done => {
      const db = new MongoDBConnection(uri, options)

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
          expect(mongoose.connect).to.have.been.callCount(1)
          expect(db.connect).to.have.been.callCount(2)
          expect(db.beforeConnection).to.have.been.callCount(1)
          expect(db.onConnectionSuccess).to.have.been.callCount(1)
          expect(connection).to.equal(mongoose.connection)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })

    it('should reject if an error occurs', done => {
      const db = new MongoDBConnection(uri, options)

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
          expect(mongoose.connect).to.have.been.callCount(1)
          expect(db.connect).to.have.been.callCount(1)
          expect(db.beforeConnection).to.have.been.callCount(1)
          expect(db.onConnectionSuccess).to.have.been.callCount(0)
          expect(db.onConnectionError).to.have.been.callCount(1)
          expect(err).to.match(/Fake mongoose error/)
          done()
        })
        .catch(done)
    })

    it('should attach the event listeners and call the callback functions', done => {
      const db = new MongoDBConnection(uri, options)

      sinon.stub(process, 'exit') // do not terminate the app
      sinon.stub(mongoose, 'connect').resolves()
      sinon.spy(mongoose.connection, 'on')
      sinon.spy(db, 'onConnecting')
      sinon.spy(db, 'onConnected')
      sinon.spy(db, 'onDisconnecting')
      sinon.spy(db, 'onDisconnected')
      sinon.spy(db, 'onReconnected')
      sinon.spy(db, 'onReconnectFailed')
      sinon.spy(db, 'onClose')
      sinon.spy(db, 'onError')

      db
        .connect()
        .then(() => {
          expect(mongoose.connection.on.callCount).to.equal(8, 'should have registered 8 event listeners')

          // simulate 2 calls of each event
          for (let i = 0; i < 2; i++) {
            mongoose.connection.emit('connecting')
            mongoose.connection.emit('connected')
            mongoose.connection.emit('disconnecting')
            mongoose.connection.emit('disconnected')
            mongoose.connection.emit('reconnected')
            mongoose.connection.emit('reconnectFailed')
            mongoose.connection.emit('close')
            mongoose.connection.emit('error', new Error('Fake error connection.'))
          }

          expect(db.onConnecting).to.have.been.callCount(1)
          expect(db.onConnected).to.have.been.callCount(1)
          expect(db.onDisconnecting).to.have.been.callCount(2)
          expect(db.onDisconnected).to.have.been.callCount(2)
          expect(db.onReconnected).to.have.been.callCount(2)
          expect(db.onReconnectFailed).to.have.been.callCount(2)
          expect(db.onClose).to.have.been.callCount(2)
          expect(db.onError).to.have.been.callCount(2)

          return db.close() // this will clean the dbInstance
        })
        .then(() => {
          done()
        })
        .catch(done)
    })
  })

  describe('isConnected - method', () => {
    it('should return false by default', () => {
      const db = new MongoDBConnection(uri, options)

      expect(db.isConnected()).to.equal(false)
    })
  })
})
