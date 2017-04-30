'use strict';

const Connection = require('./connection');

/**
 * @private
 * @function initSocket
 * @param {IO} io The [socket.io](https://socket.io) server instance to connect to
 * @param {Handler} handler The handler instance to use for routing
 * @returns {IO} the `io` parameter
**/
module.exports = exports = function (io, handler) {
  io.on('connection', sock => {
    // eslint-disable-next-line no-new
    new Connection(sock, handler);
  });
  return io;
};
