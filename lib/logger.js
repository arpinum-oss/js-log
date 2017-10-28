'use strict';

const path = require('path');
const levels = require('./levels');

const defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
  category: 'default',
  filter: process.env.LOG_FILTER || '.*',
  console
};

function createLogger(options = {}) {
  validateArgs();
  const _options = buildOptions();
  const configuredLevel = levels[_options.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateArgs() {
    if (options.level !== undefined) {
      if (notA(options.level, 'string')) {
        throw new Error('level must be a string');
      }
      if (levels[options.level] === undefined) {
        throw new Error(`level ${options.level} is invalid, pick one in [${Object.keys(levels)}]`);
      }
    }
    if (options.category !== undefined && notA(options.category, 'string')) {
      throw new Error('category must be a string');
    }
    if (options.filter !== undefined && notA(options.filter, 'string')) {
      throw new Error('filter must be a string');
    }
    if (options.fileName !== undefined && notA(options.fileName, 'string')) {
      throw new Error('fileName must be a string');
    }
    if (options.console !== undefined) {
      if (notA(options.console.log, 'function')) {
        throw new Error('console#log must be a function');
      }
      if (notA(options.console.warn, 'function')) {
        throw new Error('console#warn must be a function');
      }
      if (notA(options.console.error, 'function')) {
        throw new Error('console#error must be a function');
      }
    }
  }

  function buildOptions() {
    return Object.assign(
      {},
      defaultOptions,
      options,
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

  function notA(value, type) {
    return value === null || typeof value !== type;
  }
}

module.exports = createLogger;
