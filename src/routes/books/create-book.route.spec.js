const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose')

const server = require('../../server')

chai.use(require('chai-http'))

describe('Create Book Route - Functional Tests', () => {
  afterEach(() => {
    mongoose.deleteModel(/.+/)
  })

  describe('POST /book', () => {
    it('should create a new book', done => {
      chai.request(server)
        .post('/book')
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body).to.deep.equal({
            status: 'success',
            data: null
          })
          done(err)
        })
    })
  })
})
