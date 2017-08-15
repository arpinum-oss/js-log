'use strict';

const createLogger = require('./logger');

module.exports = {
  logger: createLogger(),
  createLogger,
  LoggerContract: require('./loggerContract')
};
