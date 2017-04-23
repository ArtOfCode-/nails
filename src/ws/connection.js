exports = module.exports = class Connection {
  /**
   * @class Connection
   * @memberof module:nails
   * @classdesc
   * A class that manages a socket connection and creates channels as needed.
   * @description
   * You should not need to create an instance of this class yourself. Nails will
   * create an instance for each WebSocket connection.
   * @param {Socket} socket The [socket.io](https://socket.io) socket that is connecting
   * @param {Handler} handler The handler object to use to find channels
  **/
  constructor(socket, handler) {
    /**
     * @member {Socket} sock The [socket.io](https://socket.io) socket
     * @memberof module:nails.Connection
     * @instance
    **/
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
