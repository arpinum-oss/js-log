import { LevelName } from './levels';
import { createLogger, LoggerOptions } from './logger';

const ConsoleSpy = jest.fn<Console>(() => ({
  log: jest.fn().mockReturnValue(undefined),
  error: jest.fn().mockReturnValue(undefined),
  warn: jest.fn().mockReturnValue(undefined)
}));

describe('Logger', () => {
  let consoleSpy: Console;

  beforeEach(() => {
    consoleSpy = new ConsoleSpy();
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

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
  });

  it('should log prefixing the message with default category if no category is provided', () => {
    const logger = create();

    logger.info('the message');

    assertLoggedPrefixIncludes('[default]');
  });

  it('should log prefixing the message with category based on file name', () => {
    const logger = create({ fileName: 'the/file.js' });

    logger.info('the message');

    assertLoggedPrefixIncludes('[file]');
  });

  it('should log prefixing the message with category based on provided category', () => {
    const logger = create({ category: 'custom' });

    logger.info('the message');

    assertLoggedPrefixIncludes('[custom]');
  });

  it('should log if provided category filter regex matches category', () => {
    const logger = create({ category: 'custom', filter: 'ust' });

    logger.info('the message');

    assertLoggedPrefixIncludes('[custom]');
  });

  it("won't log if provided category filter regex does not match category", () => {
    const logger = create({ category: 'custom', filter: 'MyUberService' });

    logger.info('the message');

    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it("won't be created with level not a string", () => {
    const creation = () => create({ level: 3 as any });

    expect(creation).toThrow('level must be a string');
  });

  it("won't be created with unknown log level", () => {
    const creation = () => create({ level: 'unknown' as LevelName });

    expect(creation).toThrow('level unknown is invalid');
  });

  it("won't be created with category not a string", () => {
    const creation = () => create({ category: 3 as any });

    expect(creation).toThrow('category must be a string');
  });

  it("won't be created with filter not a string", () => {
    const creation = () => create({ filter: 3 as any });

    expect(creation).toThrow('filter must be a string');
  });

  it("won't be created with fileName not a string", () => {
    const creation = () => create({ fileName: 3 as any });

    expect(creation).toThrow('fileName must be a string');
  });

  it("won't be created with console having log property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { log: 3 }) });

    expect(creation).toThrow('console#log must be a function');
  });

  it("won't be created with console having warn property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { warn: 3 }) });

    expect(creation).toThrow('console#warn must be a function');
  });

  it("won't be created with console having error property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { error: 3 }) });

    expect(creation).toThrow('console#error must be a function');
  });

  function create(options: LoggerOptions = {}) {
    return createLogger(
      Object.assign(
        {
          level: 'all',
          console: consoleSpy
        },
        options
      )
    );
  }

  function assertLoggedWithLevelAndMessage(level: string, message: string) {
    expect((consoleSpy as any)[level]).toHaveBeenCalled();
    expect((consoleSpy as any)[level].mock.calls[0][1]).toContain(message);
  }

  function assertLoggedPrefixIncludes(prefix: string) {
    expect(consoleSpy.log).toHaveBeenCalled();
    expect((consoleSpy as any).log.mock.calls[0][0]).toContain(prefix);
  }
});
