const { expect } = require('../../test')
const Book = require('./book.model')

describe('Book Model - Unit Tests', () => {
  describe('instance initialization', () => {
    it('should create an instance of a Book with all its public props', () => {
      const book = new Book()
      const expectedKeys = [
        '_id',
        'title',
        'authors',
        'pages',
        'isbn',
        'publisher',
        'publicationDate',
        'edition',
        'createdAt',
        'updatedAt'
      ]

      expect(book).to.be.an.instanceOf(Book)
      expect(book.toObject()).to.have.all.keys(expectedKeys)
    })

    it('should create a book with all its props and default values', () => {
      const book = new Book()

      expect(book).to.have.property('_id').that.is.an.objectId()
      expect(book).to.have.property('title', '')
      expect(book).to.have.property('authors').that.is.an('array').with.length(0)
      expect(book).to.have.property('pages', 0)
      expect(book).to.have.property('isbn', '')
      expect(book).to.have.property('publisher', '')
      expect(book).to.have.property('publicationDate').that.is.a('date')
      expect(book).to.have.property('edition', '')
      expect(book).to.have.property('createdAt').that.is.a('date')
      expect(book).to.have.property('updatedAt').that.is.a('date')
    })

    it('should create a book with the values provided', () => {
      const bookData = {
        title: 'Algorithms',
        authors: ['Robert Sedgewick'],
        pages: 976,
        isbn: '032157351X',
        publisher: 'Addison-Wesley Professional',
        publicationDate: new Date(Date.UTC(2011, 2, 19)),
        edition: '4th',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const book = new Book(bookData)

      expect(book).to.have.property('title', bookData.title)
      expect(book).to.have.property('authors').that.deep.equals(bookData.authors)
      expect(book).to.have.property('pages', bookData.pages)
      expect(book).to.have.property('isbn', bookData.isbn)
      expect(book).to.have.property('publisher', bookData.publisher)
      expect(book).to.have.property('publicationDate', bookData.publicationDate)
      expect(book).to.have.property('edition', bookData.edition)
      expect(book).to.have.property('createdAt', bookData.createdAt)
      expect(book).to.have.property('updatedAt', bookData.updatedAt)
    })

    it('should create a book by casting the values provided', () => {
      const bookData = {
        title: 1984, // expected type of String
        authors: 'George Orwell', // expected type of Array
        pages: '304', // expected type of Number
        isbn: '1328869334',
        publisher: 'Houghton Mifflin Harcourt',
        publicationDate: Date.UTC(2017, 3, 4), // expected type of Date
        edition: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const book = new Book(bookData)

      expect(book).to.have.property('title').that.equals(String(bookData.title))
      expect(book).to.have.property('authors').that.deep.equals([bookData.authors])
      expect(book).to.have.property('pages').that.equals(Number(bookData.pages))
      expect(book).to.have.property('isbn', bookData.isbn)
      expect(book).to.have.property('publisher', bookData.publisher)
      expect(book).to.have.property('publicationDate').that.deep.equals(new Date(bookData.publicationDate))
      expect(book).to.have.property('edition', bookData.edition)
      expect(book).to.have.property('createdAt', bookData.createdAt)
      expect(book).to.have.property('updatedAt', bookData.updatedAt)
    })
  })

  describe('validation', () => {
    describe('required fields', () => {
      it('should fail when required properties are missing', () => {
        const book = new Book()
        const error = book.validateSync()

        expect(error).to.be.an('object')
        expect(error).to.have.deep.nested.property('errors.title.message', 'Path `title` is required.')
        expect(error).to.have.deep.nested.property('errors.authors.message', 'Path `authors` should have at least one element.')
      })

      it('should succeed when required properties are provided', () => {
        const book = new Book({ title: 'Eloquent JavaScript', authors: ['Marijn Haverbeke'] })
        const error = book.validateSync()

        expect(error).to.equal(undefined)
      })
    })

    describe('wrong type of values', () => {
      it('should fail when wrong type of values are provided', () => {
        const wrongBookData = {
          title: [], // expected type of String
          authors: {}, // expected type of Array
          pages: 'NaN', // expected type of Number
          createdAt: true // expected type of Date
        }
        const book = new Book(wrongBookData)
        const error = book.validateSync()

        expect(error).to.have.deep.nested.property('errors.title.message', 'Cast to String failed for value "[]" at path "title"')
        expect(error).to.have.deep.nested.property('errors.authors.message', 'Cast to Array failed for value "{}" at path "authors"')
        expect(error).to.have.deep.nested.property('errors.pages.message', 'Cast to Number failed for value "NaN" at path "pages"')
        expect(error).to.have.deep.nested.property('errors.createdAt.message', 'Cast to Date failed for value "true" at path "createdAt"')
      })
    })
  })
})
