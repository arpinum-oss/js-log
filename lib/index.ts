export * from './logger';
export * from './contracts';

import { createLogger, Logger } from './logger';
export const logger: Logger = createLogger();
