import { Level } from "./levels";
import {
  createLogger,
  GetDateString,
  GetLogInputs,
  LoggerOptions,
} from "./logger";
import { ConsoleMethod } from "./console";

describe("Logger", () => {
  let consoleSpy: Console;

  beforeEach(() => {
    consoleSpy = createMock<Console>({
      debug: jest.fn().mockReturnValue(undefined),
      log: jest.fn().mockReturnValue(undefined),
      error: jest.fn().mockReturnValue(undefined),
      warn: jest.fn().mockReturnValue(undefined),
    });
  });

  it("should log with console.debug for debug level", () => {
    const logger = create();

    logger.debug("the message");

    assertLoggedWithMethodAndMessage("debug", "the message");
  });

  it("should fallback to console.log if no console.debug", () => {
    const logger = create({
      console: Object.assign({}, consoleSpy, { debug: undefined }),
    });

    logger.debug("the message");

    assertLoggedWithMethodAndMessage("log", "the message");
  });

  it("should log with console.log for info level", () => {
    const logger = create();

    logger.info("the message");

    assertLoggedWithMethodAndMessage("log", "the message");
  });

  it("should log with console.warn for warn level", () => {
    const logger = create();

    logger.warn("the message");

    assertLoggedWithMethodAndMessage("warn", "the message");
  });

  it("should fallback to console.log if no console.warn", () => {
    const logger = create({
      console: Object.assign({}, consoleSpy, { warn: undefined }),
    });

    logger.warn("the message");

    assertLoggedWithMethodAndMessage("log", "the message");
  });

  it("should log with console.error for error level", () => {
    const logger = create();

    logger.error("the message");

    assertLoggedWithMethodAndMessage("error", "the message");
  });

  it("should fallback to console.log if no console.error", () => {
    const logger = create({
      console: Object.assign({}, consoleSpy, { error: undefined }),
    });

    logger.error("the message");

    assertLoggedWithMethodAndMessage("log", "the message");
  });

  it("should log if logger priority is greater than given one", () => {
    const logger = create({ level: Level.debug });

    logger.error("the message");

    assertLoggedWithMethodAndMessage("error", "the message");
  });

  it("won't log if logger priority is smaller than given one", () => {
    const logger = create({ level: Level.error });

    logger.debug("the message");

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
  });

  it("should log using get date string if provided", () => {
    const logger = create({ getDateString: () => "today" });

    logger.info("the message");

    assertLoggedPrefixIncludes("today");
  });

  it("should log prefixing the message with default category if no category is provided", () => {
    const logger = create();

    logger.info("the message");

    assertLoggedPrefixIncludes("[default]");
  });

  it("should log prefixing the message with category based on file name", () => {
    const logger = create({ fileName: "the/file.js" });

    logger.info("the message");

    assertLoggedPrefixIncludes("[file]");
  });

  it("should log prefixing the message with category based on provided category", () => {
    const logger = create({ category: "custom" });

    logger.info("the message");

    assertLoggedPrefixIncludes("[custom]");
  });

  it("should create an output with date, category, level and message", () => {
    const logger = create({
      getDateString: () => "today",
      category: "awesome",
    });

    logger.info("the message");

    expect(consoleSpy.log).toHaveBeenCalledWith(
      "today - info: [awesome]",
      "the message",
    );
  });

  it("should create an output based on custom formatter if provided", () => {
    const logger = create({
      getDateString: () => "today",
      category: "awesome",
      getLogInputs: ({ date, category, level, args }) => [
        `${date}|${category}|${level}`,
        ...args,
      ],
    });

    logger.info("the", "message");

    expect(consoleSpy.log).toHaveBeenCalledWith(
      "today|awesome|info",
      "the",
      "message",
    );
  });

  it("should omit date if date provider is null", () => {
    const logger = create({
      getDateString: null,
      category: "awesome",
    });

    logger.info("the message");

    expect(consoleSpy.log).toHaveBeenCalledWith(
      "info: [awesome]",
      "the message",
    );
  });

  it("should log if provided category filter regex matches category", () => {
    const logger = create({ category: "custom", filter: "ust" });

    logger.info("the message");

    assertLoggedPrefixIncludes("[custom]");
  });

  it("won't log if provided category filter regex does not match category", () => {
    const logger = create({ category: "custom", filter: "MyUberService" });

    logger.info("the message");

    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it("should log though level is provided as string", () => {
    const logger = create({ level: "info" });

    logger.info("the message");

    assertLoggedWithMethodAndMessage("log", "the message");
  });

  it("won't be created with level not a string", () => {
    const creation = () => create({ level: 3 as any as Level });

    expect(creation).toThrow("level must be a string");
  });

  it("won't be created with unknown log level", () => {
    const creation = () => create({ level: "unknown" as Level });

    expect(creation).toThrow("level unknown is invalid");
  });

  it("won't be created with category not a string", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const creation = () => create({ category: 3 as any });

    expect(creation).toThrow("category must be a string");
  });

  it("won't be created with filter not a string", () => {
    const creation = () => create({ filter: 3 as any as string });

    expect(creation).toThrow("filter must be a string");
  });

  it("won't be created with fileName not a string", () => {
    const creation = () => create({ fileName: 3 as any as string });

    expect(creation).toThrow("fileName must be a string");
  });

  it("won't be created with console having log property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { log: 3 }) });

    expect(creation).toThrow("console#log must be a function");
  });

  it("won't be created with console having warn property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { warn: 3 }) });

    expect(creation).toThrow("console#warn must be a function");
  });

  it("won't be created with console having error property not a function", () => {
    const creation = () =>
      create({ console: Object.assign({}, consoleSpy, { error: 3 }) });

    expect(creation).toThrow("console#error must be a function");
  });

  it("won't be created with getDateString not a function", () => {
    const creation = () => create({ getDateString: 3 as any as GetDateString });

    expect(creation).toThrow("getDateString must be a function");
  });

  it("won't be created with getLogInputs not a function", () => {
    const creation = () => create({ getLogInputs: 3 as any as GetLogInputs });

    expect(creation).toThrow("getLogInputs must be a function");
  });

  function create(options: LoggerOptions = {}) {
    return createLogger(
      Object.assign(
        {
          level: Level.all,
          console: consoleSpy,
        },
        options,
      ),
    );
  }

  function assertLoggedWithMethodAndMessage(
    method: ConsoleMethod,
    message: string,
  ) {
    expect(consoleSpy[method]).toHaveBeenCalledWith(
      expect.any(String),
      message,
    );
  }

  function assertLoggedPrefixIncludes(prefix: string) {
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining(prefix),
      expect.any(String),
    );
  }
});

export function createMock<T>(properties: Partial<T> = {}): T {
  return properties as T;
}
