import { Console, ConsoleOut } from "./console";

export type LogFunc = (console: Console) => ConsoleOut;

export enum LogLevel {
  all = "all",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  off = "off",
}

export interface LogLevelConfiguration {
  priority: number;
  log?: LogFunc;
}

export const logLevels: Record<LogLevel, LogLevelConfiguration> = {
  [LogLevel.all]: {
    priority: 1,
  },
  [LogLevel.debug]: {
    priority: 2,
    log: (console) => console.debug || console.log,
  },
  [LogLevel.info]: {
    priority: 3,
    log: (console) => console.log,
  },
  [LogLevel.warn]: {
    priority: 4,
    log: (console) => console.warn || console.log,
  },
  [LogLevel.error]: {
    priority: 5,
    log: (console) => console.error || console.log,
  },
  off: {
    priority: 6,
  },
};
