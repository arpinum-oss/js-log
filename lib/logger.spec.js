'use strict';

const sinon = require('sinon');
const LoggerContract = require('./loggerContract');
const Logger = require('./logger');

describe('The logger', () => {

  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: sinon.spy(),
      error: sinon.spy(),
      warn: sinon.spy()
    };
  });

  it('should match LoggerContract', () => {
    const logger = createLogger();

    LoggerContract.is(logger).should.be.true;
  });

  it('should log with console.log for trace level', () => {
    const logger = createLogger();

    logger.trace('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log with console.log for debug level', () => {
    const logger = createLogger();

    logger.debug('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log with console.log for info level', () => {
    const logger = createLogger();

    logger.info('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log with console.warn for warn level', () => {
    const logger = createLogger();

    logger.warn('the message');

    assertLoggedWithLevelAndMessage('warn', 'the message');
  });

  it('should log with console.error for error level', () => {
    const logger = createLogger();

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('should log if logger priority is greater than given one', () => {
    const logger = createLogger({level: 'debug'});

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('wont log if logger priority is smaller than given one', () => {
    const logger = createLogger({level: 'error'});

    logger.debug('the message');

    sinon.assert.notCalled(consoleSpy.log);
    sinon.assert.notCalled(consoleSpy.error);
  });

  it('should log prefixing the message with default category if no category is provided', () => {
    const logger = createLogger();

    logger.info('the message');

    assertLoggedPrefixIncludes(['[default]']);
  });

  it('should log prefixing the message with category based on file name', () => {
    const logger = createLogger({fileName: 'the/file.js'});

    logger.info('the message');

    assertLoggedPrefixIncludes(['[file]']);
  });

  it('should log prefixing the message with category based on provided category', () => {
    const logger = createLogger({category: 'custom'});

    logger.info('the message');

    assertLoggedPrefixIncludes(['[custom]']);
  });

  it('should log if provided category filter regex matches category', () => {
    const logger = createLogger({category: 'custom', filter: 'ust'});

    logger.info('the message');

    assertLoggedPrefixIncludes(['[custom]']);
  });

  it('wont log if provided category filter regex does not match category', () => {
    const logger = createLogger({category: 'custom', filter: 'MyUberService'});

    logger.info('the message');

    sinon.assert.notCalled(consoleSpy.log);
  });

  it('wont be created with unknown log level', () => {
    const creation = () => createLogger({level: 'unknown'});

    creation.should.throw(Error, 'Level unknown is invalid');
  });

  function createLogger(options) {
    const _options = Object.assign({
      level: 'all',
      console: consoleSpy
    }, options);
    return new Logger(_options);
  }

  function assertLoggedWithLevelAndMessage(level, message) {
    sinon.assert.called(consoleSpy[level]);
    consoleSpy[level].lastCall.args[1].should.equal(message);
  }

  function assertLoggedPrefixIncludes(prefix) {
    sinon.assert.called(consoleSpy.log);
    consoleSpy.log.lastCall.args[0].should.includes(prefix);
  }
});
