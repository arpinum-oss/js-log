'use strict';

const createLogger = require('./logger');

module.exports = {
  contracts: require('./contracts'),
  logger: createLogger(),
  createLogger
};
