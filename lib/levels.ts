import { Console, ConsoleOut } from "./console";

export type LogFunc = (console: Console) => ConsoleOut;

export type Levels = {
  [key in Level]: LevelConfiguration;
};

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

// tslint:disable no-console
export const levels: Levels = {
  [Level.all]: {
    priority: 1,
  },
  [Level.debug]: {
    priority: 2,
    // tslint:disable-next-line:no-console
    log: (console) => console.debug || console.log,
  },
  [Level.info]: {
    priority: 3,
    // tslint:disable-next-line:no-console
    log: (console) => console.log,
  },
  [Level.warn]: {
    priority: 4,
    // tslint:disable-next-line:no-console
    log: (console) => console.warn || console.log,
  },
  [Level.error]: {
    priority: 5,
    // tslint:disable-next-line:no-console
    log: (console) => console.error || console.log,
  },
  off: {
    priority: 6,
  },
};
// tslint:enable no-console
