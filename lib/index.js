'use strict';

const Logger = require('./Logger');
const TypedLogger = require('./TypedLogger');

module.exports = {
  Logger: options => Logger(options),
  logger: Logger(),
  TypedLogger
};
