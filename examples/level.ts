import { createLogger, Level } from '../lib';

const logger = createLogger({ level: Level.info });

logger.info('Will be displayed');
logger.debug('Will not be displayed');

// 2017-07-18T08:13:39.497Z - info: [default] Will be displayed
