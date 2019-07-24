const { expect, sinon } = require('../../test')
const { MockFactory, BookModelMock: BookModel } = require('../../test/mocks')
const BookService = require('./book.service')

describe('Book Service - Unit Tests', () => {
  let service

  beforeEach(() => {
    service = new BookService({ BookModel })
  })

  describe('initialization', () => {
    it('should be initialized correctly', () => {
      expect(service).to.be.instanceOf(BookService)
      expect(Object.keys(service)).to.deep.equal(['BookModel'])
      expect(service.BookModel).to.equal(BookModel)
      expect(service).to.have.property('createBook').to.be.a('function')
      expect(service).to.have.property('getAllBooks').to.be.a('function')
    })
  })

  describe('createBook - method', () => {
    it('should create a new book with the data provided', done => {
      const bookData = MockFactory.createBook()

      sinon.spy(BookModel, 'create')

      service.createBook(bookData)
        .then(book => {
          expect(BookModel.create).to.have.been.calledWith(bookData)
          sinon.assert.match(book, {
            _id: sinon.match.object,
            title: bookData.title,
            authors: sinon.match.array.deepEquals(bookData.authors),
            pages: bookData.pages,
            isbn: bookData.isbn,
            publisher: bookData.publisher,
            publicationDate: bookData.publicationDate,
            edition: bookData.edition,
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
          })
          done()
        })
        .catch(done)
    })
  })

  describe('getAllBooks - method', () => {
    it('should return an empty array if there are no books', done => {
      service.getAllBooks()
        .then(books => {
          expect(books).to.be.an('array').that.is.empty // eslint-disable-line
          done()
        })
        .catch(done)
    })

    it('should return all the books', done => {
      const expectedBooks = MockFactory.createRandomBooks(5).map(book => book.toDocument())

      sinon.stub(BookModel, 'find').resolves(expectedBooks)

      service.getAllBooks()
        .then(books => {
          expect(books).to.deep.equal(expectedBooks)
          done()
        })
        .catch(done)
    })
  })

  describe('getBookById - method', () => {
    it('should return the book when found', done => {
      const bookId = MockFactory.createMongoId()
      const expectedBook = MockFactory.createBook({ _id: bookId }).toDocument()

      sinon
        .stub(BookModel, 'findById')
        .callThrough()
        .withArgs(expectedBook._id).resolves(expectedBook)

      service.getBookById(bookId)
        .then(book => {
          expect(BookModel.findById).to.have.been.calledWith(bookId)
          expect(book).to.deep.equals(expectedBook)
          done()
        })
        .catch(done)
    })

    it('should return null when not found', done => {
      const wrongId = MockFactory.createMongoId()
      const expectedBook = MockFactory.createBook().toDocument()

      sinon
        .stub(BookModel, 'findById')
        .callThrough()
        .withArgs(expectedBook._id).resolves(expectedBook)

      service.getBookById(wrongId)
        .then(book => {
          expect(BookModel.findById).to.have.been.calledWith(wrongId)
          expect(book).to.equal(null)
          done()
        })
        .catch(done)
    })
  })
})
