const { chai, expect } = require('../../test')
const server = require('../../server')

describe('GET /health - Functional Tests', () => {
  it('should respond with a success status #sanity', done => {
    chai.request(server)
      .get('/health')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal({ status: 'success' })
        done(err)
      })
  })
})
