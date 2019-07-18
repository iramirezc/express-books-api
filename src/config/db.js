const { MONGO_DB } = require('../config')
const { formatDBUri } = require('../common/utils')
const MongoDBConnector = require('../common/facades/mongoose.facade')

const db = new MongoDBConnector(formatDBUri(MONGO_DB), MONGO_DB.options)

module.exports = db
