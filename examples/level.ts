import { createLogger, LogLevel } from "../lib";

const logger = createLogger({
  level: LogLevel.info,
  getDateString: null,
});

logger.info("Will be displayed");
logger.debug("Will not be displayed");

// 2017-07-18T08:13:39.497Z - info: [default] Will be displayed
