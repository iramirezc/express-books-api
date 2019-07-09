const Book = require('../../models/book')

module.exports = (req, res) => {
  const {
    title,
    authors,
    pages,
    isbn,
    publisher,
    publicationDate,
    edition
  } = req.body

  return Book
    .create({
      title,
      authors,
      pages,
      isbn,
      publisher,
      publicationDate,
      edition
    })
    .then(book => {
      return res.status(201).json({
        status: 'success',
        data: book
      })
    })
    .catch(err => {
      return res.status(400).json({
        status: 'fail',
        message: String(err)
      })
    })
}
