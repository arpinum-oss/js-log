import { assert } from '@arpinum/defender';

import { basename } from './basename';
import { ConsoleOut } from './console';
import { LevelName, levels, LogFunc } from './levels';

export interface LoggerOptions {
  level?: LevelName;
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

export function createLogger(options: LoggerOptions = {}): Logger {
  validateArgs();
  const theOptions = buildOptions();
  const configuredLevel = levels[theOptions.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateArgs() {
    assert(options.level, 'level').toBeAString();
    if (options.level !== undefined && levels[options.level] === undefined) {
      throw new Error(
        `level ${options.level} is invalid, pick one in [${Object.keys(
          levels
        )}]`
      );
    }
    assert(options.category, 'options#category').toBeAString();
    assert(options.filter, 'options#filter').toBeAString();
    assert(options.fileName, 'options#fileName').toBeAString();
    if (options.console !== undefined) {
      assert(options.console.log, 'options#console#log').toBeAFunction();
      assert(options.console.warn, 'options#console#warn').toBeAFunction();
      assert(options.console.error, 'options#console#error').toBeAFunction();
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
    return (Object.keys(levels) as LevelName[]).reduce(
      levelReducer,
      {}
    ) as Logger;
  }

  function levelReducer(result: {}, level: LevelName) {
    return Object.assign(
      result,
      levels[level].log ? { [level]: createLoggingFunction(level) } : {}
    );
  }

  function createLoggingFunction(levelKey: LevelName): ConsoleOut {
    const level = levels[levelKey];
    if (configuredLevel.priority <= level.priority && allowedToLog) {
      const logFunction = (level.log as LogFunc)(theOptions.console);
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
}
