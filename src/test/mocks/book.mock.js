const faker = require('faker')

const { BookModel } = require('../../models')

const Book = {
  init (props) {
    Object.assign(this, {
      title: faker.lorem.words(),
      authors: this.generateAuthors(),
      pages: faker.random.number({ max: 3000 }),
      isbn: faker.helpers.replaceSymbols('978-#-##-######-#'),
      publisher: faker.company.companyName(),
      publicationDate: faker.date.past(faker.random.number(10)),
      edition: faker.helpers.replaceSymbols('#th')
    })

    return Object.assign(this, props)
  },
  generateAuthors () {
    const authors = []
    const nAuthors = faker.random.number({ min: 1, max: 3 })

    for (let i = 0; i < nAuthors; i++) {
      authors.push(faker.name.findName())
    }

    return authors
  },
  toDocument () {
    const tempBook = Object.create(Book)
    tempBook.init(new BookModel(this).toObject())
    return tempBook
  },
  toJSONObject () {
    return JSON.parse(JSON.stringify(this))
  }
}

const createBook = (props = {}) => {
  const book = Object.create(Book)

  book.init(props)

  return book
}

const createRandomBooks = n => {
  const nBooks = faker.random.number({ min: 1, max: n })
  const books = []

  for (let i = 0; i < nBooks; i++) {
    books.push(createBook())
  }

  return books
}

module.exports = { Book, createBook, createRandomBooks }
