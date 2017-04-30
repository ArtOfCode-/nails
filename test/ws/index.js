'use strict';

const { it } = require('mocha');

const debug = require('debug')('nails:test');

const initSocket = require('../../src/ws');
const { IO } = require('./util');

module.exports = ({ server }) => {
  let connect;
  initSocket({
    on(connection, f) {
      connect = f;
    },
  }, server.handler);
  it('connects', () => {
    const io = new IO();
    connect(io);
  });
  it('joins the correct room', done => {
    const io = new IO();
    io.join = function (room) {
      if (room === '/status') {
        return done();
      }
      done(false);
    };
    connect(io);
    process.nextTick(() => {
      io.emit('join', '/status');
    });
  });
  it('receives status messages', done => {
    const io = new IO();
    io.on('message', arg => {
      if (['ok', '👍', '⚠', '🚨'].includes(arg)) {
        done();
      } else {
        done(new Error('bad message: ' + require('util').inspect(arg, { depth: null })));
      }
    });
    connect(io);
    process.nextTick(() => {
      io.emit('join', '/status');
    });
    io.on('error', err => {
      debug('err!', err);
      done(err);
      io.close();
    });
  });
};
