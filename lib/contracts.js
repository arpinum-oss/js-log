function contracts(t) {
  const LoggerContract = t.interface({
    debug: t.Function,
    info: t.Function,
    warn: t.Function,
    error: t.Function
  }, 'LoggerContract');

  return {
    LoggerContract
  };
}

module.exports = contracts;
