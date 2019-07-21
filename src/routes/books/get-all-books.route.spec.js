const { chai, expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const server = require('../../server')

describe('GET /books - Functional Tests', () => {
  it('should respond with a success status and all the books', done => {
    const expectedBooks = MockFactory.createRandomBooks(10).map(book => book.toDocumentJSON())

    sinon.stub(BookService.getInstance(), 'getAllBooks').resolves(expectedBooks)

    chai.request(server)
      .get('/books')
      .then(res => {
        expect(res.status).to.equal(200)
        expect(BookService.getInstance().getAllBooks).to.have.been.calledOnce // eslint-disable-line
        expect(res.body.status).to.equal('success')
        expect(res.body.data).to.deep.equal(expectedBooks)
        done()
      })
      .catch(done)
  })

  it('should respond with a fail status and the reason of failure', done => {
    sinon.stub(BookService.getInstance(), 'getAllBooks').rejects('Fake getAllBooks error.')

    chai.request(server)
      .get('/books')
      .then(res => {
        expect(BookService.getInstance().getAllBooks).to.have.been.calledOnce // eslint-disable-line
        expect(res.status).to.equal(500)
        expect(res.body).to.have.property('status', 'fail')
        expect(res.body).to.have.property('message')
          .that.matches(/Fake getAllBooks error/)
        done()
      })
      .catch(done)
  })
})
