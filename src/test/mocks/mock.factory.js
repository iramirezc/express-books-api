const httpMocks = require('node-mocks-http')

const bookMocks = require('./book.mocks')

class MockFactory {
  static createBook () {
    return bookMocks.createBook(...arguments)
  }

  static createRandomBooks () {
    return bookMocks.createRandomBooks(...arguments)
  }

  static createHttpRequest () {
    return httpMocks.createRequest(...arguments)
  }

  static createHttpResponse () {
    return httpMocks.createResponse(...arguments)
  }
}

module.exports = MockFactory
