const mongoose = require('mongoose')

const deleteMongooseModels = () => {
  return mongoose.deleteModel(/.+/) // delete all mongoose models to prevent OverwriteModelErrors
}

module.exports = {
  deleteMongooseModels
}
