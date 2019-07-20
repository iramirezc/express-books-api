const { MONGO_DB: { host, port, name, options, settings } } = require('../config')
const { formatMongoDBStringURI } = require('../shared/utils')
const MongoDBConnection = require('../shared/facades/mongodb.connection')

const db = new MongoDBConnection(formatMongoDBStringURI({ host, port, name }), options, settings)

module.exports = db
