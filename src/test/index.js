const chai = require('chai')
const sinon = require('sinon')
const { expect } = chai

chai.use(require('chai-http'))
chai.use(require('sinon-chai'))
chai.use(require('./helpers/book.model.helper'))

module.exports = {
  chai,
  expect,
  sinon
}
