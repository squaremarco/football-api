const { createLogger, format, transports } = require('winston');
const { combine, timestamp, splat, printf, colorize } = format;

const pretty = printf(log => {
  return `${log.timestamp} - ${log.level} ${log.message}`;
});

const logger = createLogger({
  format: combine(timestamp(), splat(), colorize(), pretty),
  transports: [new transports.Console()]
});

module.exports = logger;
