const mongoose = require('mongoose')

function isProvided (prop) {
  return typeof prop !== 'undefined'
}

module.exports = chai => {
  const Assertion = chai.Assertion

  Assertion.addMethod('book', function (expected) {
    const obj = this._obj
    const expects = new Assertion(obj)

    expects.to.have.a.property('_id').which.is.an.instanceOf(mongoose.Types.ObjectId)
    if (isProvided(expected._id)) new Assertion(String(obj._id)).to.equal(String(expected._id))
    expects.to.have.a.property('title').which.is.equal(expected.title)
    expects.to.have.a.property('authors').which.is.deep.equal(expected.authors)
    expects.to.have.a.property('pages').which.is.equal(expected.pages)
    expects.to.have.a.property('isbn').which.is.equal(expected.isbn)
    expects.to.have.a.property('publisher').which.is.equal(expected.publisher)
    expects.to.have.a.property('publicationDate').which.is.equalDate(expected.publicationDate)
    expects.to.have.a.property('edition').which.is.equal(expected.edition)
    expects.to.have.a.property('createdAt').which.is.a('Date')
    if (isProvided(expected.createdAt)) new Assertion(obj.createdAt).to.equalTime(expected.createdAt)
    expects.to.have.a.property('updatedAt').which.is.a('Date')
    if (isProvided(expected.updatedAt)) new Assertion(obj.updatedAt).to.equalTime(expected.updatedAt)
  })
}
