const { chai, expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const server = require('../../server')

describe('GET /books/:bookId - Functional Tests', () => {
  const buildUrl = bookId => `/books/${bookId}`

  it('should respond with a success status and the book found', done => {
    const expectedBook = MockFactory.createBook().toDocumentJSON()

    sinon.stub(BookService.getInstance(), 'getBookById').resolves(expectedBook)

    chai.request(server)
      .get(buildUrl(expectedBook._id))
      .then(res => {
        expect(BookService.getInstance().getBookById).to.have.been.calledWith(expectedBook._id)
        expect(res.status).to.equal(200)
        expect(res.body.status).to.equal('success')
        expect(res.body.data).to.deep.equal(expectedBook)
        done()
      })
      .catch(done)
  })

  it('should respond with a fail status when book is not found', done => {
    const bookId = MockFactory.createMongoId()

    sinon.stub(BookService.getInstance(), 'getBookById').resolves(null)

    chai.request(server)
      .get(buildUrl(bookId))
      .then(res => {
        expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
        expect(res.status).to.equal(404)
        expect(res.body.status).to.equal('fail')
        expect(res.body.message).to.match(/bookId '.+' not found/)
        done()
      })
      .catch(done)
  })

  it('should respond with a fail status and a server error if something goes wrong', done => {
    const bookId = MockFactory.createMongoId()

    sinon.stub(BookService.getInstance(), 'getBookById').rejects('Fake service error')

    chai.request(server)
      .get(buildUrl(bookId))
      .then(res => {
        expect(BookService.getInstance().getBookById).to.have.been.calledWith(String(bookId))
        expect(res.status).to.equal(500)
        // TODO: validate message when implementing Error Handler middleware
        done()
      })
      .catch(done)
  })
})
