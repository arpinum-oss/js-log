export * from './levels';
export * from './logger';

import { createLogger, Logger } from './logger';
export const logger: Logger = createLogger();
