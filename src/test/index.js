const chai = require('chai')
const sinon = require('sinon')
const { expect } = chai

chai.use(require('chai-http'))
chai.use(require('sinon-chai'))
chai.use(require('./helpers/book.model.helper'))
chai.use(require('./helpers/mongoose.helper'))

const utils = require('./utils')

module.exports = {
  chai,
  expect,
  sinon,
  utils
}
