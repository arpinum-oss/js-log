'use strict';

const sinon = require('sinon');
const Logger = require('./Logger');

describe('The logger', () => {

  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: sinon.spy(),
      error: sinon.spy()
    };
  });

  it('should log on stdout for trace level', () => {
    let logger = createLogger();

    logger.trace('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log on stdout for debug level', () => {
    let logger = createLogger();

    logger.debug('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log on stdout for info level', () => {
    let logger = createLogger();

    logger.info('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log on stderr for warn level', () => {
    let logger = createLogger();

    logger.warn('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('should log on stderr for error level', () => {
    let logger = createLogger();

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('should log if logger priority is greater than given one', () => {
    let logger = createLogger({level: 'debug'});

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('wont log if logger priority is smaller than given one', () => {
    let logger = createLogger({level: 'error'});

    logger.debug('the message');

    consoleSpy.log.should.not.have.been.called;
    consoleSpy.error.should.not.have.been.called;
  });

  it('should log prefixing the message with default category if no category is provided', () => {
    let logger = createLogger();

    logger.info('the message');

    assertLoggedPrefixIncludes(['[default]']);
  });

  it('should log prefixing the message with category based on file name', () => {
    let logger = createLogger({fileName: 'the/file.js'});

    logger.info('the message');

    assertLoggedPrefixIncludes(['[file]']);
  });

  it('should log prefixing the message with category based on provided category', () => {
    let logger = createLogger({category: 'custom'});

    logger.info('the message');

    assertLoggedPrefixIncludes(['[custom]']);
  });

  it('wont be created with unknown log level', () => {
    let creation = () => createLogger({level: 'unknown'});

    creation.should.throw(Error, 'Level unknown is invalid');
  });

  function createLogger(options) {
    let _options = Object.assign({
      level: 'all',
      console: consoleSpy
    }, options);
    return Logger(_options);
  }

  function assertLoggedWithLevelAndMessage(level, message) {
    consoleSpy[level].should.have.been.called;
    consoleSpy[level].lastCall.args[1].should.equal(message);
  }

  function assertLoggedPrefixIncludes(prefix) {
    consoleSpy.log.should.have.been.called;
    consoleSpy.log.lastCall.args[0].should.includes(prefix);
  }
});
