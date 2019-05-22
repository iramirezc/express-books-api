const expect = require('chai').expect

const HelloRoute = require('./hello.route')

let res = {
  send (args) {
    this.sendCalledWithArgs = args
  }
}

describe('Hello Route - Unit Tests', () => {
  it('should return Hello World', () => {
    HelloRoute.handler(null, res)
    expect(res.sendCalledWithArgs).to.eql('<h1>Hello World!</h1>')
  })
})
