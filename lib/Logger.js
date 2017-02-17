'use strict';

const t = require('tcomb');
const path = require('path');
const levels = require('./levels');
const TypedLogger = require('./TypedLogger');

function Factory(options = {}) {
  let _options = buildOptions();
  validateLevel();
  let configuredLevel = levels[_options.level];
  let instance = {};
  createLoggingFunctions();
  return instance;

  function validateLevel() {
    if (_options.level !== undefined && levels[_options.level] === undefined) {
      throw new Error(`Level ${_options.level} is invalid, pick one in [${Object.keys(levels)}]`);
    }
  }

  function buildOptions() {
    return Object.assign(
      {level: process.env.ENGINE__LOG_LEVEL || 'info', category: 'default', console},
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
        instance[levelKey] = createLoggingFunction(levelKey);
      }
    }
  }

  function createLoggingFunction(levelKey) {
    let level = levels[levelKey];
    if (configuredLevel.priority <= level.priority) {
      let logFunction = level.log(_options.console);
      return (...args) => {
        logFunction(`${date()} - ${levelKey}: [${_options.category}]`, ...args);
      };
    }
    return () => undefined;
  }

  function date() {
    return new Date().toISOString();
  }
}

const Creation = t.maybe(t.interface({
  level: t.maybe(t.String),
  category: t.maybe(t.String),
  fileName: t.maybe(t.String),
  console: t.interface({
    log: t.Function,
    error: t.Function
  })
}));

module.exports = t.func(Creation, TypedLogger).of(Factory);
