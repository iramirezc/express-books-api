const { chai, expect, sinon } = require('../../test')
const server = require('../../server')
const db = require('../../config/db')

describe('GET /health - Functional Tests', () => {
  it('should respond with a success status #sanity', done => {
    sinon.stub(db, 'isConnected').returns(true)

    chai.request(server)
      .get('/health')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal({
          status: 'success',
          data: {
            api: true,
            db: true
          }
        })
        done(err)
      })
  })
})
