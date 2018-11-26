const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.connect(
  `mongodb://${DB_HOST}:${DB_PORT}`,
  { useNewUrlParser: true, dbName: DB_NAME }
);

mongoose.connection.on('error', err => {
  logger.error(`[${err.name}]: ${err.message}`);
});

module.exports = mongoose.connection;
