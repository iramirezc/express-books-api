const faker = require('faker')
const _merge = require('lodash/merge')

const Book = {
  init(props) {
    Object.assign(this, {
      title: faker.lorem.words(),
      authors: this.generateAuthors(),
      pages: faker.random.number({ max: 3000 }),
      isbn: faker.helpers.replaceSymbols('978-#-##-######-#'),
      publisher: faker.company.companyName(),
      publicationDate: faker.date.past(faker.random.number(10)),
      edition: faker.helpers.replaceSymbols('#th')
    })

    return _merge(this, props)
  },
  generateAuthors () {
    const authors = []
    const nAuthors = faker.random.number({ min: 1, max: 3 })

    for (let i = 0; i < nAuthors; i++) {
      authors.push(faker.name.findName())
    }

    return authors
  },
  toObject() {
    return JSON.parse(JSON.stringify(this))
  }
}

const buildBook = (props = {}) => {
  const book = Object.create(Book)

  book.init(props)

  return book
}

module.exports = {
  buildBook
}