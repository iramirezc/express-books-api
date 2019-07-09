const mongoose = require('mongoose')

const BookSchema = require('./book.schema')

const Book = mongoose.model('Book', BookSchema)

module.exports = Book
