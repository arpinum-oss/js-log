'use strict';

const Logger = require('./Logger');
const levels = require('./levels');

module.exports = {
  createLogger: options => new Logger(options),
  logger: new Logger(),
  levels: Object.keys(levels)
};
