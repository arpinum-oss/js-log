const t = require('tcomb');

const LoggerContract = t.interface({
  debug: t.Function,
  info: t.Function,
  warn: t.Function,
  error: t.Function
}, 'LoggerContract');

module.exports = LoggerContract;
