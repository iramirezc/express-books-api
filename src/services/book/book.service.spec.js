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
      expect(service).to.have.property('updateBookById').to.be.a('function')
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

      BookModel.insertMany(expectedBooks) // BookModel.insertMany is faster than BookModel.create
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

  describe('updateBookById - method', () => {
    it('should update a book by changing all the allowed fields', done => {
      const bookId = MockFactory.createMongoId()
      const originalBook = MockFactory.createBook({ _id: bookId }).toDocument()
      const newBookData = {
        title: 'new title',
        authors: ['first author', 'second author'],
        pages: 1000,
        isbn: '978-1-23-456789-0',
        publisher: 'new publisher',
        publicationDate: new Date(),
        edition: 'nth'
      }
      const expectedBook = MockFactory.createBook({ ...originalBook, ...newBookData }).toDocument()

      sinon.spy(BookModel, 'findByIdAndUpdate')

      BookModel.insertMany(originalBook)
        .then(() => {
          expect(originalBook._id).to.deep.equal(expectedBook._id)
          expect(originalBook.createdAt).to.equalDate(expectedBook.createdAt)
          expect(originalBook.updatedAt).to.equalDate(expectedBook.updatedAt)
          expect(originalBook.title).not.to.equal(expectedBook.title)
          expect(originalBook.authors).not.to.deep.equal(expectedBook.authors)
          expect(originalBook.pages).not.to.equal(expectedBook.pages)
          expect(originalBook.isbn).not.to.equal(expectedBook.isbn)
          expect(originalBook.publisher).not.to.equal(expectedBook.publisher)
          expect(originalBook.publicationDate).not.to.equalDate(expectedBook.publicationDate)
          expect(originalBook.edition).not.to.equal(expectedBook.edition)

          return service.updateBookById(bookId, newBookData)
        })
        .then(returnedBook => {
          expect(BookModel.findByIdAndUpdate).to.have.been.calledWithMatch(bookId, newBookData)
          expect(returnedBook).to.be.book(newBookData)

          return BookModel.findById(bookId)
        })
        .then(savedBook => {
          expect(savedBook._id).to.deep.equal(originalBook._id)
          expect(savedBook.createdAt).to.equalTime(originalBook.createdAt)
          expect(savedBook.updatedAt).to.afterTime(originalBook.updatedAt)
          expect(savedBook.title).to.equal(expectedBook.title)
          expect(savedBook.authors).to.deep.equal(expectedBook.authors)
          expect(savedBook.pages).to.equal(expectedBook.pages)
          expect(savedBook.isbn).to.equal(expectedBook.isbn)
          expect(savedBook.publisher).to.equal(expectedBook.publisher)
          expect(savedBook.publicationDate).to.equalDate(expectedBook.publicationDate)
          expect(savedBook.edition).to.equal(expectedBook.edition)
          done()
        })
        .catch(done)
    })

    it('should only update the updatedAt field when other fields are undefined', done => {
      const bookId = MockFactory.createMongoId()
      const expectedCreatedAtDate = Date.now() + 1
      const expectedUpdatedAtDate = Date.now() + 2
      const originalBook = MockFactory.createBook({
        _id: bookId,
        createdAt: expectedCreatedAtDate,
        updatedAt: expectedUpdatedAtDate
      }).toDocument()
      const newBookData = {
        _id: MockFactory.createMongoId(),
        createdAt: Date.now() + 3,
        updatedAt: Date.now() + 4
      }

      sinon.spy(BookModel, 'findByIdAndUpdate')

      BookModel.insertMany(originalBook)
        .then(() => service.updateBookById(bookId, newBookData))
        .then(() => {
          expect(BookModel.findByIdAndUpdate).to.have.been.calledWithMatch(bookId, {})

          return BookModel.findById(bookId)
        })
        .then(savedBook => {
          expect(savedBook._id).to.deep.equal(originalBook._id)
          expect(savedBook.createdAt).to.equalTime(originalBook.createdAt)
          expect(savedBook.updatedAt).to.afterTime(originalBook.updatedAt)
          expect(savedBook.title).to.equal(originalBook.title)
          expect(savedBook.authors).to.deep.equal(originalBook.authors)
          expect(savedBook.pages).to.equal(originalBook.pages)
          expect(savedBook.isbn).to.equal(originalBook.isbn)
          expect(savedBook.publisher).to.equal(originalBook.publisher)
          expect(savedBook.publicationDate).to.equalDate(originalBook.publicationDate)
          expect(savedBook.edition).to.equal(originalBook.edition)
          done()
        })
        .catch(done)
    })

    it('should not update the book when a field is invalid', done => {
      const bookId = MockFactory.createMongoId()
      const originalBook = MockFactory.createBook({ _id: bookId }).toDocument()
      const newBookData = MockFactory.createBook({ title: '', authors: [] })

      sinon.spy(BookModel, 'findByIdAndUpdate')

      BookModel.insertMany(originalBook)
        .then(() => service.updateBookById(bookId, newBookData))
        .then(() => {
          done(new Error('service.updateBookById was supposed to fail.'))
        })
        .catch(err => {
          expect(BookModel.findByIdAndUpdate).to.have.been.calledWithMatch(bookId, newBookData)
          expect(err).to.match(/ValidationError/)
            .and.to.match(/Path `authors` should have at least one element/)
            .and.to.match(/Path `title` is required/)

          return BookModel.findById(bookId)
        })
        .then(savedBook => {
          expect(savedBook._id).to.deep.equal(originalBook._id)
          expect(savedBook.createdAt).to.equalTime(originalBook.createdAt)
          expect(savedBook.updatedAt).to.equalTime(originalBook.updatedAt)
          expect(savedBook.title).to.equal(originalBook.title)
          expect(savedBook.authors).to.deep.equal(originalBook.authors)
          expect(savedBook.pages).to.equal(originalBook.pages)
          expect(savedBook.isbn).to.equal(originalBook.isbn)
          expect(savedBook.publisher).to.equal(originalBook.publisher)
          expect(savedBook.publicationDate).to.equalDate(originalBook.publicationDate)
          expect(savedBook.edition).to.equal(originalBook.edition)
          done()
        })
        .catch(done)
    })
  })
})
