'use strict';

const Logger = require('./Logger');
const levels = require('./levels');

module.exports = {
  log: options => new Logger(options),
  levels: Object.keys(levels)
};
