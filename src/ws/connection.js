exports = module.exports = class Connection {
  constructor(socket, handler) {
    this.sock = socket;
    socket.on('join', room => {
      socket.join(room);
      const val = handler.getHandler({ url: room, method: 'ws' });
      if (!val) {
        throw new Error('no match found');
      }
      const { route: { method: Channel }, params } = val;
      // eslint-disable-next-line no-new
      new Channel({ params, socket });
    });
  }
};
