'use strict';

const Logger = require('./Logger');

module.exports = {
  createLogger: options => new Logger(options),
  logger: new Logger()
};
