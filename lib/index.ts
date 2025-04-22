export { LogLevel } from "./logLevels";
export {
  Logger,
  createLogger,
  LoggerOptions,
  CurrentLog,
  GetLogInputs,
} from "./logger";

import { createLogger, Logger } from "./logger";

export const logger: Logger = createLogger();
