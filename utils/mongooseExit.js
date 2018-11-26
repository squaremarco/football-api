const { DB_HOST, DB_PORT } = process.env;

const logger = require('./logger');

module.exports = (connection, level, message, exitVal) => {
  return Promise.reject(
    connection.close(() => {
      logger.log(level, message);
      logger.info(`Closing connection to ${DB_HOST}:${DB_PORT}/${connection.db.databaseName}`);
      process.exit(exitVal);
    })
  );
};
