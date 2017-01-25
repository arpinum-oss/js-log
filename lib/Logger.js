'use strict';

const path = require('path');
const levels = require('./levels');

class Logger {

  constructor(options) {
    let _options = Object.assign(
      {level: process.env.ENGINE__LOG_LEVEL},
      {level: 'info', console},
      options);

    let configuredLevel = levels[_options.level];

    for (let levelKey of Object.keys(levels)) {
      if (levels[levelKey].log) {
        this[levelKey] = createLoggerMessageFunc(levelKey);
      }
    }

    function createLoggerMessageFunc(levelKey) {
      let level = levels[levelKey];
      if (configuredLevel.priority <= level.priority) {
        return (...args) => {
          level.log(_options.console)(`${date()} - ${levelKey}: [${category()}]`, ...args);
        };
      }
      return () => undefined;
    }

    function date() {
      return new Date().toISOString();
    }

    function category() {
      return _options.fileName
        ? path.basename(_options.fileName, path.extname(_options.fileName))
        : 'default';
    }
  }
}

module.exports = Logger;
