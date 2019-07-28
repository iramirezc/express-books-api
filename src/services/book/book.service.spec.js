const { expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookModel } = require('../../models')
const db = require('../../config/db')
const BookService = require('./book.service')

describe('Book Service - Integration Tests', () => {
  let service

  before(done => {
    db.connect().then(() => done(), done)
  })

  after(done => {
    db.close().then(() => done(), done)
  })

  beforeEach(() => {
    service = new BookService({ BookModel })
  })

  afterEach(done => {
    BookModel.deleteMany().then(() => done(), done)
  })

  describe('initialization', () => {
    it('should be initialized correctly', () => {
      expect(service).to.be.instanceOf(BookService)
      expect(service.BookModel).to.equal(BookModel)
      expect(Object.keys(service)).to.deep.equal(['BookModel'], 'only specified keys should be public')
      expect(service).to.have.property('createBook').to.be.a('function')
      expect(service).to.have.property('getAllBooks').to.be.a('function')
      expect(service).to.have.property('getBookById').to.be.a('function')
      expect(service).to.have.property('validatePayload').to.be.a('function')
    })
  })

  describe('createBook - method', () => {
    it('should save a new book with the data provided', done => {
      const bookData = MockFactory.createBook()

      sinon.stub(BookService, 'fromPayload').returns(bookData) // forcing to include extra props
      sinon.spy(BookModel, 'create')

      service.createBook(bookData)
        .then(returnedBook => {
          expect(BookService.fromPayload).to.have.been.calledWith(bookData)
          expect(BookModel.create).to.have.been.calledWith(bookData)
          expect(returnedBook).to.be.book(bookData)
          return BookModel.findById(returnedBook._id)
        })
        .then(savedBook => {
          expect(savedBook).to.be.book(bookData)
          done()
        })
        .catch(done)
    })

    it('should not save the book if data provided is wrong', done => {
      const bookId = MockFactory.createMongoId()
      const bookData = MockFactory.createBook({ _id: bookId, title: '' })

      sinon.stub(BookService, 'fromPayload').returns(bookData)
      sinon.spy(BookModel, 'create')

      service.createBook(bookData)
        .then(() => {
          done(new Error('service.create was supposed to fail.'))
        })
        .catch(err => {
          expect(BookService.fromPayload).to.have.been.calledWith(bookData)
          expect(BookModel.create).to.have.been.calledWith(bookData)
          expect(err).to.match(/ValidationError/)
          return BookModel.findById(bookId)
        })
        .then(savedBook => {
          expect(savedBook).to.be.equal(null)
          done()
        })
        .catch(done)
    })
  })

  describe('getAllBooks - method', () => {
    it('should return all the books', done => {
      const expectedBooks = MockFactory.createRandomBooks(10)

      BookModel.insertMany(expectedBooks)
        .then(service.getAllBooks.bind(service))
        .then(savedBooks => {
          savedBooks.forEach((book, i) => {
            expect(book).to.be.book(expectedBooks[i])
          })
          done()
        })
        .catch(done)
    })

    it('should return an empty array if there are no books', done => {
      sinon.spy(BookModel, 'find')

      service.getAllBooks()
        .then(books => {
          expect(BookModel.find).to.have.been.calledWith({})
          expect(books).to.be.an('array').with.length(0)
          done()
        })
        .catch(done)
    })
  })

  describe('getBookById - method', () => {
    it('should return the book when found', done => {
      const bookId = MockFactory.createMongoId()
      const expectedBook = MockFactory.createBook({ _id: bookId }).toDocument()

      sinon.spy(BookModel, 'findById')

      BookModel.insertMany(expectedBook)
        .then(service.getBookById.bind(service, bookId))
        .then(book => {
          expect(BookModel.findById).to.have.been.calledWith(bookId)
          expect(book).to.be.book(expectedBook)
          done()
        })
        .catch(done)
    })

    it('should return null when not found', done => {
      const wrongId = MockFactory.createMongoId()
      const someBook = MockFactory.createBook()

      sinon.spy(BookModel, 'findById')

      BookModel.insertMany(someBook)
        .then(service.getBookById.bind(service, wrongId))
        .then(book => {
          expect(BookModel.findById).to.have.been.calledWith(wrongId)
          expect(book).to.equal(null)
          done()
        })
        .catch(done)
    })
  })

  describe('validatePayload - method', () => {
    it('should resolve a payload as valid', done => {
      const payload = MockFactory.createBook()

      sinon.spy(BookService, 'fromPayload')

      service.validatePayload(payload)
        .then(() => {
          expect(BookService.fromPayload).to.have.been.calledWith(payload)
          done()
        })
        .catch(done)
    })

    it('should reject when the payload is invalid', done => {
      const payload = MockFactory.createBook({ title: '' })

      sinon.spy(BookService, 'fromPayload')

      service.validatePayload(payload)
        .then(() => {
          done(new Error('service.validatePayload was supposed to fail.'))
        })
        .catch(err => {
          expect(BookService.fromPayload).to.have.been.calledWith(payload)
          expect(err).to.match(/ValidationError/)
          done()
        })
        .catch(done)
    })
  })
})
