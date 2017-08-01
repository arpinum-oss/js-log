'use strict';

const levels = {
  all: {
    priority: 1
  },
  trace: {
    priority: 2,
    log: console => console.log
  },
  debug: {
    priority: 3,
    log: console => console.log
  },
  info: {
    priority: 4,
    log: console => console.log
  },
  warn: {
    priority: 5,
    log: console => console.warn
  },
  error: {
    priority: 6,
    log: console => console.error
  },
  off: {
    priority: 7
  }
};

module.exports = levels;

