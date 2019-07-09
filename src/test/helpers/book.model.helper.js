const Book = require('../../models/book/book.model')

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion

  Assertion.addMethod('book', function () {
    const obj = this._obj

    this.assert(
      obj instanceof Book,
      'expected #{this} to be a instance of #{exp} but got #{act}',
      'expected #{this} not to be a instance #{act}',
      Book.name, // expected
      obj.constructor.name // actual
    )
  })
}
