const mongooseExit = require('./mongooseExit');

module.exports = err =>
  mongooseExit(
    'error',
    `${err.syscall} [${err.code || err.errno}] ${err.hostname} ${err.hostname}:${err.port}, aborting...`,
    0
  );
