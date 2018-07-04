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

export const levels: Levels = {
  all: {
    priority: 1
  },
  debug: {
    priority: 2,
    log: console => console.log
  },
  info: {
    priority: 3,
    log: console => console.log
  },
  warn: {
    priority: 4,
    log: console => console.warn
  },
  error: {
    priority: 5,
    log: console => console.error
  },
  off: {
    priority: 6
  }
};
