import { assert } from "@arpinum/defender";

import { basename } from "./basename";
import { ConsoleOut, Console } from "./console";
import { Level, LevelConfiguration, levels, LogFunc } from "./levels";

export type GetDateString = () => string;

export interface CurrentLog {
  date: string;
  category: string;
  level: string;
  args: unknown[];
}

export type GetLogInputs = (log: CurrentLog) => unknown[];

export interface LoggerOptions {
  level?: Level | string;
  category?: string;
  fileName?: string;
  filter?: string;
  console?: Console;
  getDateString?: GetDateString | null;
  getLogInputs?: GetLogInputs;
}

interface ResolvedLoggerOptions {
  level: Level;
  category: string;
  filter: string;
  console: Console;
  getDateString: GetDateString | null;
  getLogInputs: GetLogInputs;
}

interface ProcessEnv {
  [key: string]: string | undefined;
}

declare let process: {
  env: ProcessEnv;
};

const defaultOptions = {
  level: (process.env.ARP_LOG_LEVEL as Level) || Level.info,
  category: "default",
  filter: process.env.ARP_LOG_FILTER || ".*",
  console,
  getDateString: () => new Date().toISOString(),
  getLogInputs: getDefaultLogInputs,
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
    assert(options.level, "level").toBeAString();
    if (
      options.level !== undefined &&
      levels[options.level as Level] === undefined
    ) {
      const levelList = Object.keys(levels).join(",");
      throw new Error(
        `level ${options.level} is invalid, pick one in [${levelList}]`
      );
    }
    assert(options.category, "options#category").toBeAString();
    assert(options.filter, "options#filter").toBeAString();
    assert(options.fileName, "options#fileName").toBeAString();
    if (options.console !== undefined) {
      assert(options.console.log, "options#console#log").toBeAFunction();
      assert(options.console.warn, "options#console#warn").toBeAFunction();
      assert(options.console.error, "options#console#error").toBeAFunction();
    }
    if (options.getDateString !== null) {
      assert(options.getDateString, "getDateString").toBeAFunction();
    }
    assert(options.getLogInputs, "getLogInputs").toBeAFunction();
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
      category: basename(options.fileName),
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
      return (...args: unknown[]) => {
        const inputs = theOptions.getLogInputs({
          date:
            theOptions.getDateString !== null ? theOptions.getDateString() : "",
          category: theOptions.category,
          level,
          args,
        });
        logFunction(...inputs);
      };
    }
    return () => undefined;
  }
};

function getDefaultLogInputs(log: CurrentLog): unknown[] {
  const { date, category, level, args } = log;
  const datePart = date ? `${date} - ` : "";
  return [`${datePart}${level}: [${category}]`, ...args];
}
