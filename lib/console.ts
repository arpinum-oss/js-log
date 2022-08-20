export type ConsoleOut = (...args: unknown[]) => void;

export interface Console {
  debug?: ConsoleOut;
  log: ConsoleOut;
  warn?: ConsoleOut;
  error?: ConsoleOut;
}

export type ConsoleMethod = keyof Console;
