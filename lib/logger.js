'use strict';

const t = require('tcomb');
const path = require('path');
const levels = require('./levels');

const Options = t.maybe(t.interface({
  level: t.maybe(t.String),
  category: t.maybe(t.String),
  fileName: t.maybe(t.String),
  console: t.maybe(t.interface({
    log: t.Function,
    error: t.Function
  }))
}));

class Logger {

  constructor(options = {}) {
    const self = this;
    this._options = buildOptions();
    validateLevel();
    const configuredLevel = levels[this._options.level];
    createLoggingFunctions();

    function validateLevel() {
      if (self._options.level !== undefined && levels[self._options.level] === undefined) {
        throw new Error(`Level ${self._options.level} is invalid, pick one in [${Object.keys(levels)}]`);
      }
    }

    function buildOptions() {
      return Object.assign(
        {level: process.env.LOG_LEVEL || 'info', category: 'default', console},
        Options(options),
        maybeWithCategoryFromFileName());
    }

    function maybeWithCategoryFromFileName() {
      if (!options.fileName) {
        return {};
      }
      return {category: path.basename(options.fileName, path.extname(options.fileName))};
    }

    function createLoggingFunctions() {
      for (const levelKey of Object.keys(levels)) {
        if (levels[levelKey].log) {
          self[levelKey] = createLoggingFunction(levelKey);
        }
      }
    }

    function createLoggingFunction(levelKey) {
      const level = levels[levelKey];
      if (configuredLevel.priority <= level.priority) {
        const logFunction = level.log(self._options.console);
        return (...args) => {
          logFunction(`${date()} - ${levelKey}: [${self._options.category}]`, ...args);
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
