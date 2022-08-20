# @arpinum/log [![Build Status](https://github.com/arpinum-oss/js-log/workflows/CI/badge.svg)](https://github.com/arpinum-oss/js-log/actions?query=workflow%3ACI)

> We are drowning in information but starved for knowledge.  
> <cite>John Naisbitt</cite>

_@arpinum/log_ is a simple module to log on stdout or stderr.

## Installation

```
npm install @arpinum/log --save
```

## Default logger

Just import default logger and start yelling messages:

```ts
import { logger } from "@arpinum/log";

logger.info("Something happened");
```

Which outputs :

```
2017-01-30T09:15:04.821Z - info: [default] Something happened
```

## Logging methods

Available methods are:

- debug
- info
- warn
- error

Each level uses corresponding method on `console` global object and fallback to `console.log` if missing for runtime
environment.

## Custom logger

You can create a fine tuned logger:

```ts
import { createLogger } from "@arpinum/log";

const logger = createLogger({ level: "error" });
logger.info("Something happened");
logger.error("Some error");
```

Which outputs :

```
2017-01-30T09:23:33.417Z - error: [default] Some error
```

### Options

You can pass those options during logger creation:

- level
  - minimum logging level amongst `all`, `debug`, `info`, `warn`, `error`, `off`
  - default is `info`
  - `LOG_LEVEL` env var may be used to set level
- category
  - the category displayed in message, useful to filter logs
  - default is `default`
- fileName
  - a category can be created from a base name without extension of a file
- filter
  - a regex to filter matching categories
  - default is `.*` (open bar)
  - `LOG_FILTER` env var may be used to set filter
- getDateString
  - a function to get a formatted date
  - default function returns `new Date().toISOString()`
  - provide `null` if you do not want a date at all
- getLogInputs
  - a function to get inputs given to `console` methods
  - used to format message as you want
  - see [Customize message](#customize-message) below

### Filtering logs

If you have multiple logger instances with various categories, you can filter logs using `filter` options
or `LOG_FILTER` env var.

Example:

```ts
// program.js
const mainLogger = createLogger({ category: "main" });
const serviceLogger = createLogger({ category: "service" });

mainLogger.info("Application started");
serviceLogger.info("Doing some stuff");
```

May be run with `LOG_FILTER=serv node program.js` to output:

```
2017-01-30T09:32:31.351Z - info: [service] Doing some stuff
```

### About category:

File name usage:

```ts
import { createLogger } from "@arpinum/log";

const logger = createLogger({ fileName: __filename });
logger.info("Something happened");
```

Which outputs :

```
2017-01-30T09:32:31.351Z - info: [MySuperClass] Something happened
```

### Customize message

`getLogInputs` will be called for each log with an object containing:

- `date`: the current date string
- `category`: the configured category
- `level`: the logger level
- `args`: all the provided args

Example:

```ts
const logger = createLogger({
  getLogInputs: ({ date, category, level, args }) => [
    `${date}|${category}|${level}`,
    ...args,
  ],
});

logger.info("My", "message");

// 2019-11-19T16:45:58.419Z|default|info My message
```

## License

[MIT](LICENSE)
