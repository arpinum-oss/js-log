'use strict';

const {Logger} = require('./logger');
const {TypedLogger} = require('./typedLogger');

module.exports = {
  Logger,
  logger: new Logger(),
  TypedLogger
};
