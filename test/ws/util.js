const EventEmitter = require('events');

exports.IO = class IO extends EventEmitter {
  send(...args) {
    this.emit('message', ...args);
  }
  join() {}
};

Object.assign(exports, require('../util'));
