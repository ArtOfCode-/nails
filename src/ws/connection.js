exports = module.exports = class Connection {
  constructor(socket, handler) {
    this.sock = socket;
    socket.on('join', room => {
      socket.join(room);
      const { route: { method: Channel }, params } = handler.getHandler({ url: room, method: 'ws' });
      // eslint-disable-next-line no-new
      new Channel({ params, socket });
    });
  }
};
