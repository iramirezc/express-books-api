const { chai, expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const { BookService } = require('../../services')
const server = require('../../server')

describe('POST /book - Functional Tests', () => {
  let BookModel

  beforeEach(() => {
    BookModel = server.locals.models.Book
  })

  it('should respond with a success status and the new created book', done => {
    const bookData = MockFactory.createBook()

    sinon.stub(BookService.getInstance(), 'createBook').resolves(new BookModel(bookData))

    chai.request(server)
      .post('/book')
      .send(bookData)
      .then(res => {
        expect(res.status).to.equal(201)
        expect(BookService.getInstance().createBook).to.have.been.calledWith(bookData.toObject())
        sinon.assert.match(res.body, {
          status: 'success',
          data: Object.assign(bookData.toObject(), {
            _id: sinon.match.string,
            createdAt: sinon.match.string,
            updatedAt: sinon.match.string
          })
        })
        done()
      })
      .catch(done)
  })

  it('should respond with a fail status and the reason of failure', done => {
    const bookData = MockFactory.createBook({ title: '', authors: [] })

    sinon.spy(BookModel, 'create')

    chai.request(server)
      .post('/book')
      .send(bookData)
      .then(res => {
        expect(BookModel.create).to.have.been.calledWith(bookData.toObject())
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property('status', 'fail')
        expect(res.body).to.have.property('message')
          .that.matches(/ValidationError/)
          .and.matches(/Path `title` is required/)
          .and.matches(/Path `authors` should have at least one element/)
        done()
      })
      .catch(done)
  })
})
