const mongoose = require('mongoose')

const { chai, expect, sinon } = require('../../test')
const { MockFactory } = require('../../test/mocks')
const server = require('../../server')

describe('Create Book Route - Functional Tests', () => {
  let BookModel

  beforeEach(() => {
    BookModel = server.get('models').Book
  })

  afterEach(() => {
    mongoose.deleteModel(/.+/)
    sinon.restore()
  })

  describe('POST /book', () => {
    it('should respond with a 201 status code and the new created book', () => {
      const bookData = MockFactory.createBook()

      sinon.stub(BookModel, 'create').resolves(new BookModel(bookData))

      return chai.request(server)
        .post('/book')
        .send(bookData)
        .then(res => {
          expect(res.status).to.equal(201)
          expect(BookModel.create).to.have.been.calledWith(bookData.toObject())
          sinon.assert.match(res.body, {
            status: 'success',
            data: Object.assign(bookData.toObject(), {
              _id: sinon.match.string,
              createdAt: sinon.match.string,
              updatedAt: sinon.match.string
            })
          })
        })
    })

    it('should respond with a 400 status code and the error message', () => {
      const bookData = MockFactory.createBook({ title: '', authors: [] })

      sinon.spy(BookModel, 'create')

      return chai.request(server)
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
        })
    })
  })
})
