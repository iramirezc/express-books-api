const { sync } = require('glob')

function install (server) {
  const models = sync('../models/*.model.js', { cwd: __dirname })

  models.forEach(modelPath => {
    console.log(`Adding model: ${modelPath}`)
    const model = require(modelPath)
    server.set(`${model.modelName}Model`, model)
  })
}

module.exports = install
