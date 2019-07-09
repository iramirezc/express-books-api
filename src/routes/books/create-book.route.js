const { createBook } = require('../../controllers/books')

module.exports = server => {
  server.post('/book', createBook)
}
