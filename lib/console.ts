export type ConsoleOut = (...args: any[]) => void;

export interface Console {
  log: ConsoleOut;
  warn: ConsoleOut;
  error: ConsoleOut;
}
