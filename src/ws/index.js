const Connection = require('./connection');

module.exports = exports = function (io, handler) {
  io.on('connection', sock => {
    // eslint-disable-next-line no-new
    new Connection(sock, handler);
  });
  return io;
};
