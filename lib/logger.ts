import { assertOptionalFunction, assertOptionalString } from "./asserts";
import { basename } from "./basename";
import { Console, ConsoleOut } from "./console";
import {
  LogLevel,
  LogLevelConfiguration,
  logLevels,
  LogFunc,
} from "./logLevels";

export type GetDateString = () => string;

export interface CurrentLog {
  date: string;
  category: string;
  level: string;
  args: unknown[];
}

export type GetLogInputs = (log: CurrentLog) => unknown[];

export interface LoggerOptions {
  level?: LogLevel | string;
  category?: string;
  fileName?: string;
  filter?: string;
  console?: Console;
  getDateString?: GetDateString | null;
  getLogInputs?: GetLogInputs;
}

interface ResolvedLoggerOptions {
  level: LogLevel;
  category: string;
  filter: string;
  console: Console;
  getDateString: GetDateString | null;
  getLogInputs: GetLogInputs;
}

type ProcessEnv = Record<string, string | undefined>;

declare let process: {
  env: ProcessEnv;
};

const defaultOptions = {
  level: getDefaultLevel(),
  category: "default",
  filter: getDefaultFilter(),
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
  const configuredLevel = logLevels[theOptions.level];
  const allowedToLog = filterMatchesCategory();
  return createLoggingFunctions();

  function validateArgs() {
    assertOptionalString(options.level, "level");
    if (
      options.level !== undefined &&
      logLevels[options.level as LogLevel] === undefined
    ) {
      const levelList = Object.keys(logLevels).join(",");
      throw new Error(
        `level ${options.level} is invalid, pick one in [${levelList}]`,
      );
    }
    assertOptionalString(options.category, "options#category");
    assertOptionalString(options.filter, "options#filter");
    assertOptionalString(options.fileName, "options#fileName");
    if (options.console !== undefined) {
      assertOptionalFunction(options.console.log, "options#console#log");
      assertOptionalFunction(options.console.warn, "options#console#warn");
      assertOptionalFunction(options.console.error, "options#console#error");
    }
    if (options.getDateString !== null) {
      assertOptionalFunction(options.getDateString, "getDateString");
    }
    assertOptionalFunction(options.getLogInputs, "getLogInputs");
  }

  function buildOptions(): ResolvedLoggerOptions {
    return Object.assign(
      {},
      defaultOptions,
      options,
      maybeWithCategoryFromFileName(),
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
    return Object.entries(logLevels).reduce(
      (result, [level, configuration]) =>
        Object.assign(
          result,
          configuration.log
            ? { [level]: createLoggingFunction(level, configuration) }
            : {},
        ),
      {} as Logger,
    );
  }

  function createLoggingFunction(
    level: string,
    configuration: LogLevelConfiguration,
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

function getDefaultLevel() {
  const fallback = LogLevel.info;
  try {
    return (process.env.ARP_LOG_LEVEL as LogLevel) || fallback;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return fallback;
  }
}

function getDefaultFilter() {
  const fallback = ".*";
  try {
    return process.env.ARP_LOG_FILTER || fallback;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return fallback;
  }
}
