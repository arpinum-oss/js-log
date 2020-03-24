import { createLogger } from "../lib";

const logger = createLogger({
  getLogInputs: ({ date, category, level, args }) => [
    `${date}|${category}|${level}`,
    ...args,
  ],
});

logger.info("My", "message");

// 2019-11-19T16:45:58.419Z|default|info My message
