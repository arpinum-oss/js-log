# @arpinum/log [![Build Status](https://travis-ci.org/arpinum-js-engine/js-engine-log.svg?branch=master)](https://travis-ci.org/arpinum-js-engine/js-engine-log)

> We are drowning in information but starved for knowledge.
> <cite>John Naisbitt</cite>

*@arpinum/log* is a simple module to log on stdout or stderr.

## Installation

    npm install @arpinum/log --save

## Default logger

Just require default logger and start yelling messages:

```javascript
const {logger} = require('@arpinum/log');

logger.info('Something happened');
```

Which outputs :

```
2017-01-30T09:15:04.821Z - info: [default] Something happened
```

## Logging methods

Available methods are:

* trace
* debug
* info
* warn
* error

## Custom logger

You can create a fine tuned logger:

```javascript
const {Logger, levels} = require('@arpinum/log');

let logger = new Logger({level: levels.error});
logger.info('Something happened');
logger.error('Some error');
```

Which outputs :

```
2017-01-30T09:23:33.417Z - error: [default] Some error
```

### Options

You can pass those options during logger creation:

* level
  * minimum logging level amongst `all`, `trace`, `debug`, `info`, `warn`, `error`, `off`
  * default is `info`
  * `LOG_LEVEL` env var may be used to set level
* category
  * the category displayed in message, useful to filter logs
  * default is `default`
* fileName
  * a category can be created from a base name without extension of a file
* filter
  * a regex to filter matching categories
  * default is `.*` (open bar)
  * `LOG_FILTER` env var may be used to set filter
  
### Filtering logs

If you have multiple logger instances with various categories, you can filter logs using `filter` options or `LOG_FILTER` env var.   

Example:

```
// program.js
const mainLogger = new Logger({category: 'main'});
const serviceLogger = new Logger({category: 'service'});

mainLogger.info('Application started');
serviceLogger.info('Doing some stuff');
```

May be run with `LOG_FILTER=serv node program.js` to output:

```
2017-01-30T09:32:31.351Z - info: [service] Doing some stuff
```

### Examples:

File name usage:

```javascript
const {Logger} = require('@arpinum/log');

const logger = new Logger({fileName: __filename});
logger.info('Something happened');  
```
Which outputs :

```
2017-01-30T09:32:31.351Z - info: [MySuperClass] Something happened
```

## License

[MIT](LICENSE)
