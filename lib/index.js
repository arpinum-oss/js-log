'use strict';

const Logger = require('./Logger');

module.exports = {
  Logger: options => Logger(options),
  logger: Logger()
};
