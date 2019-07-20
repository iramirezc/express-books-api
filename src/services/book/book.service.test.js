const { expect, sinon } = require('../../test')
const { MockFactory, BookModelMock } = require('../../test/mocks')
const BookService = require('./book.service')

describe('Book Service - Unit Tests', () => {
  let service

  beforeEach(() => {
    service = new BookService({ BookModel: BookModelMock })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('initialization', () => {
    it('should be initialized correctly', () => {
      expect(service).to.be.instanceOf(BookService)
      expect(Object.keys(service)).to.deep.equal(['BookModel'])
      expect(service.BookModel).to.equal(BookModelMock)
      expect(service).to.have.property('createBook').to.be.a('function')
      expect(service).to.have.property('getAllBooks').to.be.a('function')
    })
  })

  describe('createBook - method', () => {
    it('should create a new book with the data provided', done => {
      const bookData = MockFactory.createBook()

      sinon.spy(BookModelMock, 'create')

      service.createBook(bookData)
        .then(book => {
          expect(BookModelMock.create).to.have.been.calledWith(bookData)
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

    it('should return an error if something goes wrong', done => {
      const bookData = MockFactory.createBook()

      sinon.stub(BookModelMock, 'create').rejects('Fake Book Model validation error.')

      service.createBook(bookData)
        .then(() => {
          done(new Error('BookModel.create was supposed to fail.'))
        })
        .catch(err => {
          expect(BookModelMock.create).to.have.been.calledWith(bookData)
          expect(err).to.match(/Fake Book Model validation error/)
          done()
        })
        .catch(done)
    })
  })

  describe('getAllBooks - method', () => {
    it('should return all the books', done => {
      const expectedBooks = MockFactory.createRandomBooks(5).map(book => book.toDocument())

      sinon.stub(BookModelMock, 'find').resolves(expectedBooks)

      service.getAllBooks()
        .then(books => {
          expect(books).to.deep.equal(expectedBooks)
          done()
        })
        .catch(done)
    })

    it('should throw and error if something goes wrong', done => {
      sinon.stub(BookModelMock, 'find').rejects('Fake BookModel find error.')

      service.getAllBooks()
        .then(() => {
          done(new Error('BookModel.find was supposed to fail.'))
        })
        .catch(err => {
          expect(BookModelMock.find).to.have.been.calledOnce //eslint-disable-line
          expect(err).to.match(/Fake BookModel find error/)
          done()
        })
        .catch(done)
    })
  })
})
