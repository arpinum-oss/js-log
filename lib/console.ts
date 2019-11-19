export type ConsoleOut = (...args: any[]) => void;

export interface Console {
  debug?: ConsoleOut;
  log: ConsoleOut;
  warn?: ConsoleOut;
  error?: ConsoleOut;
}
