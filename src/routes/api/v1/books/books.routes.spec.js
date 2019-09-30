const { chai, expect, sinon } = require('../../../../test')
const { MockFactory } = require('../../../../test/mocks')
const { BookService } = require('../../../../services')
const server = require('../../../../server')

describe('API V1 Books Routes - Functional Tests', () => {
  describe('POST /api/v1/books', () => {
    it('should respond with a success status and the new created book', done => {
      const bookData = MockFactory.createBook()
      const expectedBook = MockFactory.createBook(bookData).toDocument()

      sinon.stub(BookService.getInstance(), 'createBook').resolves(expectedBook)

      chai.request(server)
        .post('/api/v1/books')
        .send(bookData)
        .then(res => {
          expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData.toJSONObject())
          expect(res.status).to.equal(201)
          expect(res.body).to.deep.equal({
            status: 'success',
            data: expectedBook.toJSONObject()
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status when payload is invalid', done => {
      const bookData = MockFactory.createBook({ title: '', authors: [] })

      sinon.spy(BookService.getInstance(), 'createBook')

      chai.request(server)
        .post('/api/v1/books')
        .send(bookData)
        .then(res => {
          expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData.toJSONObject())
          expect(res.status).to.equal(400)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: 'ValidationError: title: Path `title` is required., authors: Path `authors` should have at least one element.'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('GET /api/v1/books', () => {
    it('should respond with a success status and all the books found', done => {
      const expectedBooks = MockFactory.createRandomBooks(10).map(book => book.toDocument())

      sinon.stub(BookService.getInstance(), 'getAllBooks').resolves(expectedBooks)

      chai.request(server)
        .get('/api/v1/books')
        .then(res => {
          expect(res.status).to.equal(200)
          expect(BookService.getInstance().getAllBooks).to.have.been.calledWith()
          expect(res.body).to.deep.equal({
            status: 'success',
            data: expectedBooks.map(book => book.toJSONObject())
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status if something goes wrong', done => {
      sinon.stub(BookService.getInstance(), 'getAllBooks').rejects('Fake getAllBooks error.')

      chai.request(server)
        .get('/api/v1/books')
        .then(res => {
          expect(BookService.getInstance().getAllBooks).to.have.been.calledWith()
          expect(res.status).to.equal(500)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: 'Fake getAllBooks error.'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('GET /api/v1/books/:bookId', () => {
    const buildUrl = bookId => `/api/v1/books/${bookId}`

    it('should respond with a success status and the book found', done => {
      const bookId = MockFactory.createMongoId()
      const bookData = MockFactory.createBook({ _id: bookId })
      const expectedBook = MockFactory.createBook(bookData).toDocument()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(expectedBook)

      chai.request(server)
        .get(buildUrl(bookId))
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal({
            status: 'success',
            data: expectedBook.toJSONObject()
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status when the book is not found', done => {
      const bookId = MockFactory.createMongoId()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(null)

      chai.request(server)
        .get(buildUrl(bookId))
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: `bookId '${bookId}' not found.`
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status if something goes wrong', done => {
      const bookId = MockFactory.createMongoId()

      sinon.stub(BookService.getInstance(), 'getBookById').rejects('Fake service error')

      chai.request(server)
        .get(buildUrl(bookId))
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(res.status).to.equal(500)
          // TODO: validate message when implementing Error Handler middleware
          expect(res.body).to.deep.equal({})
          done()
        })
        .catch(done)
    })
  })

  describe('PUT /api/v1/books/:bookId', () => {
    const buildUrl = bookId => `/api/v1/books/${bookId}`

    it('should respond with a success status and the book updated', done => {
      const bookId = MockFactory.createMongoId()
      const originalBook = MockFactory.createBook({ _id: bookId }).toDocument()
      const newBookData = MockFactory.createBook()
      const expectedBook = MockFactory.createBook({ ...originalBook, ...newBookData }).toDocument()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(originalBook)
      sinon.stub(BookService.getInstance(), 'updateBookById').resolves(expectedBook)

      chai.request(server)
        .put(buildUrl(bookId))
        .send(newBookData)
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(BookService.getInstance().updateBookById).to.have.been.calledWith(String(bookId), newBookData.toJSONObject())
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal({
            status: 'success',
            data: expectedBook.toJSONObject()
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status when the book is not found', done => {
      const bookId = MockFactory.createMongoId()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(null)

      chai.request(server)
        .put(buildUrl(bookId))
        .send({})
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: `bookId '${bookId}' not found.`
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status if something goes wrong', done => {
      const bookId = MockFactory.createMongoId()
      const originalBook = MockFactory.createBook({ _id: bookId }).toDocument()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(originalBook)
      sinon.stub(BookService.getInstance(), 'updateBookById').rejects('Fake service error')

      chai.request(server)
        .put(buildUrl(bookId))
        .send({})
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(BookService.getInstance().updateBookById).to.have.been.calledWith(String(bookId), {})
          expect(res.status).to.equal(400)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: 'Fake service error'
          })
          done()
        })
        .catch(done)
    })
  })

  describe('DELETE /api/v1/books/:bookId', () => {
    const buildUrl = bookId => `/api/v1/books/${bookId}`

    it('should respond with a success status and the book deleted', done => {
      const bookId = MockFactory.createMongoId().toString()
      const expectedBook = MockFactory.createBook({ _id: bookId })

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(expectedBook)
      sinon.stub(BookService.getInstance(), 'deleteBookById').resolves(expectedBook)

      chai.request(server)
        .delete(buildUrl(bookId))
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(bookId)
          expect(BookService.getInstance().deleteBookById).to.have.been.calledWith(bookId)
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal({
            status: 'success',
            data: expectedBook.toJSONObject()
          })
          done()
        })
        .catch(done)
    })

    it('should respond with a fail status when the book is not found', done => {
      const bookId = MockFactory.createMongoId().toString()

      sinon.stub(BookService.getInstance(), 'getBookById').resolves(null)
      sinon.spy(BookService.getInstance(), 'deleteBookById')

      chai.request(server)
        .delete(buildUrl(bookId))
        .then(res => {
          expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
          expect(BookService.getInstance().deleteBookById).to.have.been.callCount(0)
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({
            status: 'fail',
            message: `bookId '${bookId}' not found.`
          })
          done()
        })
        .catch(done)
    })
  })
})
