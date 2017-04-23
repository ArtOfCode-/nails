exports = module.exports = class Channel {
  /**
   * @class Channel
   * @memberof module:nails
   * @classdesc
   * The class managing a connection. Subclass this in your `channels/` directory
   * to customize its behavior.
   * @description
   * There is generally no need for you to create your own instance of a channel,
   * because Nails will create them automatically.
   * @param {Object} options The options
   * @param {Object} options.params The params in the URL
   * @param {Socket} options.socket The [socket.io](https://socket.io) socket
  **/
  constructor({ params, socket }) {
    /**
     * @member {Object} params The URL params, just like in controllers
     * @memberof module:nails.Channel
     * @instance
    **/
    this.params = params;
    /**
     * @member {Socket} socket The [socket.io](https://socket.io) socket
     * @memberof module:nails.Channel
     * @instance
    **/
    this.socket = socket;
  }
};
