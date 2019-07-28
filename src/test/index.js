const chai = require('chai')
const { expect } = chai
const sinon = require('sinon')
const tools = require('./tools')

// install chai plugins
// ==================================================
chai.use(require('chai-datetime'))
chai.use(require('chai-http'))
chai.use(require('sinon-chai'))
chai.use(require('./helpers/book-model.helper'))
chai.use(require('./helpers/mongoose.helper'))

// global mocha configuration
// ==================================================
after(() => {
  tools.deleteMongooseModels() // prevent mongoose OverwriteModelError
})

afterEach(() => {
  sinon.restore() // restore sinon default sandbox
})

module.exports = {
  chai,
  expect,
  sinon,
  tools
}
