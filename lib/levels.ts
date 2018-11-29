import { Console, ConsoleOut } from './console';

export type LogFunc = (console: Console) => ConsoleOut;

export interface Level {
  priority: number;
  log?: LogFunc;
}

interface Levels {
  all: Level;
  debug: Level;
  info: Level;
  warn: Level;
  error: Level;
  off: Level;
}

export type LevelName = 'all' | 'debug' | 'info' | 'warn' | 'error' | 'off';

// tslint:disable no-console
export const levels: Levels = {
  all: {
    priority: 1
  },
  debug: {
    priority: 2,
    // tslint:disable-next-line:no-console
    log: console => console.log
  },
  info: {
    priority: 3,
    // tslint:disable-next-line:no-console
    log: console => console.log
  },
  warn: {
    priority: 4,
    // tslint:disable-next-line:no-console
    log: console => console.warn
  },
  error: {
    priority: 5,
    // tslint:disable-next-line:no-console
    log: console => console.error
  },
  off: {
    priority: 6
  }
};
// tslint:enable no-console
