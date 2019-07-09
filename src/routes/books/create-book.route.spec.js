const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose')
const sinon = require('sinon')

const Book = require('../../models/book')
const server = require('../../server')
const { buildBook } = require('../../test/helpers/book.mocks')

chai.use(require('chai-http'))
chai.use(require('sinon-chai'))

describe('Create Book Route - Functional Tests', () => {
  afterEach(() => {
    mongoose.deleteModel(/.+/)
    sinon.restore()
  })

  describe('POST /book', () => {
    it('should respond with a 201 status code and the new created book', () => {
      const bookData = buildBook()

      sinon.stub(Book, 'create').resolves(new Book(bookData))

      return chai.request(server)
        .post('/book')
        .send(bookData)
        .then(res => {
          expect(Book.create).to.have.been.calledWith(bookData.toObject())
          expect(res.status).to.equal(201)
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
      const bookData = buildBook({ title: '' })

      sinon.spy(Book, 'create')

      return chai.request(server)
        .post('/book')
        .send(bookData)
        .then(res => {
          expect(Book.create).to.have.been.calledWith(bookData.toObject())
          expect(res.status).to.equal(400)
          sinon.assert.match(res.body, {
            status: 'fail',
            message: sinon.match(/ValidationError: title: Path `title` is required/)
          })
        })
    })
  })
})
