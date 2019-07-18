module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SERVER: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
  },
  MONGO_DB: {
    host: process.env.MONGO_DB_HOST,
    port: process.env.MONGO_DB_PORT,
    name: process.env.MONGO_DB_NAME,
    options: {
      useNewUrlParser: true
    }
  }
}
