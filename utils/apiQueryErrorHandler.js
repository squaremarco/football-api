const mongooseConnection = require('../bin/mongooseConnection');
const mongooseExit = require('./mongooseExit');

module.exports = err =>
  mongooseExit(
    mongooseConnection,
    'error',
    `${err.syscall} [${err.code || err.errno}] ${err.hostname} ${err.hostname}:${err.port}, aborting...`,
    1
  );
