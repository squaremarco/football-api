const { DB_HOST, DB_PORT } = process.env;

const logger = require('./logger');
const mongoose = require('mongoose');

module.exports = (level, message, exitVal) => {
  return Promise.reject(
    mongoose.connection.close(() => {
      logger.log(level, message);
      logger.info(`Closing connection to ${DB_HOST}:${DB_PORT}/${mongoose.connection.db.databaseName}`);
      process.exit(exitVal);
    })
  );
};
