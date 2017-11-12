'use strict';

const sinon = require('sinon');
const { LoggerContract } = require('./contracts')(require('tcomb'));
const createLogger = require('./logger');

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: sinon.spy(),
      error: sinon.spy(),
      warn: sinon.spy()
    };
  });

  it('should match LoggerContract', () => {
    const logger = create();

    LoggerContract.is(logger).should.be.true;
  });

  it('should log with console.log for debug level', () => {
    const logger = create();

    logger.debug('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log with console.log for info level', () => {
    const logger = create();

    logger.info('the message');

    assertLoggedWithLevelAndMessage('log', 'the message');
  });

  it('should log with console.warn for warn level', () => {
    const logger = create();

    logger.warn('the message');

    assertLoggedWithLevelAndMessage('warn', 'the message');
  });

  it('should log with console.error for error level', () => {
    const logger = create();

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it('should log if logger priority is greater than given one', () => {
    const logger = create({ level: 'debug' });

    logger.error('the message');

    assertLoggedWithLevelAndMessage('error', 'the message');
  });

  it("won't log if logger priority is smaller than given one", () => {
    const logger = create({ level: 'error' });

    logger.debug('the message');

    sinon.assert.notCalled(consoleSpy.log);
    sinon.assert.notCalled(consoleSpy.error);
  });

  it('should log prefixing the message with default category if no category is provided', () => {
    const logger = create();

    logger.info('the message');

    assertLoggedPrefixIncludes(['[default]']);
  });

  it('should log prefixing the message with category based on file name', () => {
    const logger = create({ fileName: 'the/file.js' });

    logger.info('the message');

    assertLoggedPrefixIncludes(['[file]']);
  });

  it('should log prefixing the message with category based on provided category', () => {
    const logger = create({ category: 'custom' });

    logger.info('the message');

    assertLoggedPrefixIncludes(['[custom]']);
  });

  it('should log if provided category filter regex matches category', () => {
    const logger = create({ category: 'custom', filter: 'ust' });

    logger.info('the message');

    assertLoggedPrefixIncludes(['[custom]']);
  });

  it("won't log if provided category filter regex does not match category", () => {
    const logger = create({ category: 'custom', filter: 'MyUberService' });

    logger.info('the message');

    sinon.assert.notCalled(consoleSpy.log);
  });

  it("won't be created with level not a string", () => {
    const creation = () => create({ level: 3 });

    creation.should.throw(Error, 'level must be a string');
  });

  it("won't be created with unknown log level", () => {
    const creation = () => create({ level: 'unknown' });

    creation.should.throw(Error, 'level unknown is invalid');
  });

  it("won't be created with category not a string", () => {
    const creation = () => create({ category: 3 });

    creation.should.throw(Error, 'category must be a string');
  });

  it("won't be created with filter not a string", () => {
    const creation = () => create({ filter: 3 });

    creation.should.throw(Error, 'filter must be a string');
  });

  it("won't be created with fileName not a string", () => {
    const creation = () => create({ fileName: 3 });

    creation.should.throw(Error, 'fileName must be a string');
  });

  it("won't be created with console having log property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { log: 3 }) });

    creation.should.throw(Error, 'console#log must be a function');
  });

  it("won't be created with console having warn property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { warn: 3 }) });

    creation.should.throw(Error, 'console#warn must be a function');
  });

  it("won't be created with console having error property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { error: 3 }) });

    creation.should.throw(Error, 'console#error must be a function');
  });

  function create(options) {
    const _options = Object.assign(
      {
        level: 'all',
        console: consoleSpy
      },
      options
    );
    return createLogger(_options);
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
