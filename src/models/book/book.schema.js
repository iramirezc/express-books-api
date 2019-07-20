const mongoose = require('mongoose')

const { minLengthOf } = require('../../shared/utils/mongoose.validators')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    required: true
  },
  authors: {
    type: [String],
    validate: [minLengthOf(1), 'Path `{PATH}` should have at least one element.']
  },
  pages: {
    type: Number,
    default: 0
  },
  isbn: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  edition: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = BookSchema
