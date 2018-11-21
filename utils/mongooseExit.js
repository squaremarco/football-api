const logger = require('./logger');
const mongoose = require('mongoose');

module.exports = (level, message, exitVal) => {
  mongoose.connection.close(() => {
    logger.log(level, message);
    process.exit(exitVal);
  });
};
