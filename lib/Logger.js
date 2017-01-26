'use strict';

const path = require('path');
const levels = require('./levels');

class Logger {

  constructor(options = {}) {
    let self = this;
    let _options = buildOptions();
    validateLevel();
    let configuredLevel = levels[_options.level];
    createLoggingFunctions();

    function validateLevel() {
      if (_options.level !== undefined && levels[_options.level] === undefined) {
        throw new Error(`Level ${_options.level} is invalid, pick one in [${Object.keys(levels)}]`);
      }
    }

    function buildOptions() {
      return Object.assign(
        {level: process.env.ENGINE__LOG_LEVEL, category: 'default', console},
        {level: 'info'},
        options,
        maybeWithCategoryFromFileName());
    }

    function maybeWithCategoryFromFileName() {
      if (!options.fileName) {
        return {};
      }
      return {category: path.basename(options.fileName, path.extname(options.fileName))};
    }

    function createLoggingFunctions() {
      for (let levelKey of Object.keys(levels)) {
        if (levels[levelKey].log) {
          self[levelKey] = createLoggingFunction(levelKey);
        }
      }
    }

    function createLoggingFunction(levelKey) {
      let level = levels[levelKey];
      if (configuredLevel.priority <= level.priority) {
        return (...args) => {
          level.log(_options.console)(`${date()} - ${levelKey}: [${_options.category}]`, ...args);
        };
      }
      return () => undefined;
    }

    function date() {
      return new Date().toISOString();
    }
  }
}

module.exports = Logger;
