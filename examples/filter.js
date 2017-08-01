'use strict';

// run with: LOG_FILTER=serv node filter.js

const {Logger} = require('../lib');

const mainLogger = new Logger({category: 'main'});
const serviceLogger = new Logger({category: 'service'});
const uiLogger = new Logger({category: 'ui'});

mainLogger.info('Application started');
mainLogger.info('Creating service');
serviceLogger.info('Created');
serviceLogger.info('Doing some stuff');
serviceLogger.info('Doing some other stuff');
mainLogger.info('Rendering ui');
uiLogger.info('Rendering');
