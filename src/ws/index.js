const socket = require('socket.io');

module.exports = exports = function (server, socketOptions) {
  const io = socket(server, Object.assign({
    path: '/ws'
  }, socketOptions));
  return io;
};
