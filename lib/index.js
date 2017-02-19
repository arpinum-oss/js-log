'use strict';

module.exports = Object.assign(
  require('./logger'),
  require('./typedLogger'),
  {levels: require('./levels')}
);
