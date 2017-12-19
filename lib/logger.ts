import { basename } from './basename';
import { ConsoleOut } from './console';
import { levels } from './levels';

export interface Options {
  level?: string;
  category?: string;
  fileName?: string;
  filter?: string;
  console?: Console;
}

interface ProcessEnv {
  [key: string]: string | undefined;
}

declare var process: {
  env: ProcessEnv;
};

const defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
  category: 'default',
  filter: process.env.LOG_FILTER || '.*',
  console
};

export interface Logger {
  debug: ConsoleOut;
  info: ConsoleOut;
  warn: ConsoleOut;
  error: ConsoleOut;
}

export function createLogger(options: Options = {}): Logger {
  validateArgs();
  const theOptions = buildOptions();
  const configuredLevel = levels[theOptions.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateArgs() {
    if (options.level !== undefined) {
      if (notA(options.level, 'string')) {
        throw new Error('level must be a string');
      }
      if (levels[options.level] === undefined) {
        throw new Error(
          `level ${options.level} is invalid, pick one in [${Object.keys(
            levels
          )}]`
        );
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
      maybeWithCategoryFromFileName()
    );
  }

  function maybeWithCategoryFromFileName() {
    if (!options.fileName) {
      return {};
    }
    return {
      category: basename(options.fileName)
    };
  }

  function filterMatchesCategory() {
    return new RegExp(theOptions.filter).test(theOptions.category);
  }

  function createLoggingFunctions() {
    return Object.keys(levels).reduce(levelReducer, {});
  }

  function levelReducer(result: any, level: string) {
    return Object.assign(
      result,
      levels[level].log ? { [level]: createLoggingFunction(level) } : {}
    );
  }

  function createLoggingFunction(levelKey: string): ConsoleOut {
    const level = levels[levelKey];
    if (configuredLevel.priority <= level.priority && allowedToLog) {
      const logFunction = level.log(theOptions.console);
      return (...args: any[]) =>
        logFunction(
          `${date()} - ${levelKey}: [${theOptions.category}]`,
          ...args
        );
    }
    return () => undefined;
  }

  function date() {
    return new Date().toISOString();
  }

  function notA(value: any, type: string) {
    return value === null || typeof value !== type;
  }
}
