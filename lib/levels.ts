import { Console, ConsoleOut } from './console';

export interface Level {
  priority: number;
  log?: (console: Console) => ConsoleOut;
}

export interface Levels {
  [key: string]: Level;
}

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
