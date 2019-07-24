const { BookModel } = require('../../models')

module.exports = chai => {
  const Assertion = chai.Assertion

  Assertion.addMethod('book', function () {
    const obj = this._obj

    this.assert(
      obj instanceof BookModel,
      'expected #{this} to be a instance of #{exp} but got #{act}',
      'expected #{this} not to be a instance #{act}',
      BookModel.name, // expected
      obj.constructor.name // actual
    )
  })
}
