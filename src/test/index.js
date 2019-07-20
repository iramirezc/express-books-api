const chai = require('chai')
const { expect } = chai

console.log('Overriding env values...')

process.env.NODE_ENV = 'test'
process.env.MONGO_DB_NAME = 'books-test'

console.log(`> NODE_ENV=${process.env.NODE_ENV}`)
console.log(`> MONGO_DB_NAME=${process.env.MONGO_DB_NAME}`)

chai.use(require('chai-http'))
chai.use(require('sinon-chai'))
chai.use(require('./helpers/book.model.helper'))
chai.use(require('./helpers/mongoose.helper'))

module.exports = {
  chai,
  expect,
  sinon: require('sinon'),
  tools: require('./tools')
}
