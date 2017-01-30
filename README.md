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
const {createLogger, levels} = require('@arpinum/log');

let logger = createLogger({level: levels.error});
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
* category
  * the category displayed in message, useful to filter logs
  * default is `default`
* fileName
  * a category can be created from a base name without extension of a file
  
### Examples:

File name usage:

```javascript
const {createLogger} = require('@arpinum/log');

const logger = createLogger({fileName: __filename});
logger.info('Something happened');  
```
Which outputs :

```
2017-01-30T09:32:31.351Z - info: [MySuperClass] Something happened
```

## License

[MIT](LICENSE)
