const chai = require('chai')

const server = require('../../server/app')

const expect = chai.expect

chai.use(require('chai-http'))

describe('Hello Route - Functional Test', () => {
  describe('GET /', () => {
    it('should respond with Hello World #sanity', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.text).to.equal('<h1>Hello World!</h1>')
          done(err)
        })
    })
  })
})
