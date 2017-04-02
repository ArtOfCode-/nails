const Connection = require('./connection');

module.exports = exports = function (io, handler) {
  io.on('connection', sock => {
    const conn = new Connection(sock, handler);
  });
  return io;
};
