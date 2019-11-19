import { assert } from '@arpinum/defender';

import { basename } from './basename';
import { ConsoleOut } from './console';
import { Level, LevelConfiguration, levels, LogFunc } from './levels';

export type GetDateString = () => string;

export interface LoggerOptions {
  level?: Level | string;
  category?: string;
  fileName?: string;
  filter?: string;
  console?: Console;
  getDateString?: GetDateString | null;
}

interface ResolvedLoggerOptions {
  level: Level;
  category: string;
  filter: string;
  console: Console;
  getDateString: GetDateString | null;
}

interface ProcessEnv {
  [key: string]: string | undefined;
}

declare var process: {
  env: ProcessEnv;
};

const defaultOptions = {
  level: (process.env.LOG_LEVEL as Level) || Level.info,
  category: 'default',
  filter: process.env.LOG_FILTER || '.*',
  console,
  getDateString: () => new Date().toISOString()
};

export interface Logger {
  debug: ConsoleOut;
  info: ConsoleOut;
  warn: ConsoleOut;
  error: ConsoleOut;
}

export type CreateLogger = (options?: LoggerOptions) => Logger;

export const createLogger: CreateLogger = (options: LoggerOptions = {}) => {
  validateArgs();
  const theOptions = buildOptions();
  const configuredLevel = levels[theOptions.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateArgs() {
    assert(options.level, 'level').toBeAString();
    if (
      options.level !== undefined &&
      levels[options.level as Level] === undefined
    ) {
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
    if (options.getDateString !== null) {
      assert(options.getDateString, 'getDateString').toBeAFunction();
    }
  }

  function buildOptions(): ResolvedLoggerOptions {
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

  function createLoggingFunctions(): Logger {
    return Object.entries(levels).reduce(
      (result, [level, configuration]) =>
        Object.assign(
          result,
          configuration.log
            ? { [level]: createLoggingFunction(level, configuration) }
            : {}
        ),
      {} as Logger
    );
  }

  function createLoggingFunction(
    level: string,
    configuration: LevelConfiguration
  ): ConsoleOut {
    if (configuredLevel.priority <= configuration.priority && allowedToLog) {
      const logFunction = (configuration.log as LogFunc)(theOptions.console);
      const datePart = theOptions.getDateString
        ? `${theOptions.getDateString()} - `
        : '';
      return (...args: any[]) =>
        logFunction(`${datePart}${level}: [${theOptions.category}]`, ...args);
    }
    return () => undefined;
  }
};
