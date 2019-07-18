const mongoose = require('mongoose')

const { Types: { ObjectId } } = mongoose

module.exports = (chai, utils) => {
  const Assertion = chai.Assertion

  Assertion.addMethod('objectId', function () {
    const obj = this._obj

    this.assert(
      obj instanceof ObjectId,
      `expected '#{this}' to be a instance of #{exp} but got #{act}`,
      `expected '#{this}' not to be a instance #{act}`,
      ObjectId.name, // expected
      obj.constructor.name // actual
    )
  })
}
