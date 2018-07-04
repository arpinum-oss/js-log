// run with: LOG_FILTER=serv ts-node filter.ts

import { createLogger } from '../lib';

const mainLogger = createLogger({ category: 'main' });
const serviceLogger = createLogger({ category: 'service' });
const uiLogger = createLogger({ category: 'ui' });

mainLogger.info('Application started');
mainLogger.info('Creating service');
serviceLogger.info('Created');
serviceLogger.info('Doing some stuff');
serviceLogger.info('Doing some other stuff');
mainLogger.info('Rendering ui');
uiLogger.info('Rendering');
