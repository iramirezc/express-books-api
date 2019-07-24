const mongoose = require('mongoose')

/**
 * Deletes all mongoose models to prevent OverwriteModelErrors
 */
const deleteMongooseModels = () => {
  return mongoose.deleteModel(/.+/)
}

module.exports = {
  deleteMongooseModels
}
