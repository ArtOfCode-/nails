'use strict';

const EventEmitter = require('events');
/* eslint-disable require-jsdoc */

exports.IO = class IO extends EventEmitter {
  send(...args) {
    this.emit('message', ...args);
  }
  join() {}
};

Object.assign(exports, require('../util'));
