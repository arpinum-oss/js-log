'use strict';

const t = require('tcomb');
const path = require('path');
const levels = require('./levels');

const Options = t.maybe(t.interface({
  level: t.maybe(t.String),
  category: t.maybe(t.String),
  filter: t.maybe(t.String),
  fileName: t.maybe(t.String),
  console: t.maybe(t.interface({
    log: t.Function,
    error: t.Function
  }))
}));

const defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
  category: 'default',
  filter: process.env.LOG_FILTER || '.*',
  console
};

function createLogger(options = {}) {
  const _options = buildOptions();
  validateLevel();
  const configuredLevel = levels[_options.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateLevel() {
    if (_options.level !== undefined && levels[_options.level] === undefined) {
      throw new Error(`Level ${_options.level} is invalid, pick one in [${Object.keys(levels)}]`);
    }
  }

  function buildOptions() {
    return Object.assign(
      {},
      defaultOptions,
      Options(options),
      maybeWithCategoryFromFileName());
  }

  function maybeWithCategoryFromFileName() {
    if (!options.fileName) {
      return {};
    }
    return {category: path.basename(options.fileName, path.extname(options.fileName))};
  }

  function filterMatchesCategory() {
    return new RegExp(_options.filter).test(_options.category);
  }

  function createLoggingFunctions() {
    return Object.keys(levels).reduce(levelReducer, {});
  }

  function levelReducer(result, level) {
    return Object.assign(result, levels[level].log ? {[level]: createLoggingFunction(level)} : {});
  }

  function createLoggingFunction(levelKey) {
    const level = levels[levelKey];
    if (configuredLevel.priority <= level.priority && allowedToLog) {
      const logFunction = level.log(_options.console);
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

module.exports = createLogger;
