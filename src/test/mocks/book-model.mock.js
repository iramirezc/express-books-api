const { BookModel: OriginalModel } = require('../../models')

const BookModel = {
  create (props) {
    return Promise.resolve(new OriginalModel(props))
  },
  find () {
    return Promise.resolve([])
  },
  findById () {
    return Promise.resolve(null)
  }
}

module.exports = BookModel
