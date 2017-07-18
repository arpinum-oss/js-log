'use strict';

const Logger = require('./logger');

module.exports = {
  logger: new Logger(),
  Logger: require('./logger'),
  LoggerContract: require('./loggerContract'),
  levels: require('./levels')
};
