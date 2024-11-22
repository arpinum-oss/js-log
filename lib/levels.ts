import { Console, ConsoleOut } from "./console";

export type LogFunc = (console: Console) => ConsoleOut;

export type Levels = Record<Level, LevelConfiguration>;

export enum Level {
  all = "all",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  off = "off",
}

export interface LevelConfiguration {
  priority: number;
  log?: LogFunc;
}

export const levels: Levels = {
  [Level.all]: {
    priority: 1,
  },
  [Level.debug]: {
    priority: 2,
    log: (console) => console.debug || console.log,
  },
  [Level.info]: {
    priority: 3,
    log: (console) => console.log,
  },
  [Level.warn]: {
    priority: 4,
    log: (console) => console.warn || console.log,
  },
  [Level.error]: {
    priority: 5,
    log: (console) => console.error || console.log,
  },
  off: {
    priority: 6,
  },
};
