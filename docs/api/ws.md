# WebSockets
Nails has simple WebSocket support, using [`socket.io`](https://socket.io). To use WebSockets, use the `ws` function in `Router.draw` to create “channels.” Channels are like controllers, but instead of rendering a page once, they are kept alive for as long as the WebSocket stays connnected.

## Example
1. Create the file `channels/status.js` in the `app` directory, and put this content inside it:
  ```js
  const { Channel } = require('node-nails');

  module.exports = class StatusChannel extends Channel {
    constructor(...args) {
      super(...args);
      process.nextTick(() => {
        this.socket.send('ok!');
      });
    }
  };
  ```
2. In your routes.js file, ensure the `Router.draw` callback takes the `ws` argument, like this:
  ```js
  module.exports = Router.draw(({ get, ws }) => {
    // ...
  })
  ```
3. Add a `ws` route anywhere in the route config, including in `scope` calls:
  ```js
  ws('/status', 'status')
  ```
4. Include this `<script>` tag in your HTML page:
  ```html
  <script src="/socket.io/socket.io.js" charset="utf-8"></script>
  ```
5. Create the socket and join the appropriate room:
  ```js
  const socket = io();
  window.sock.emit('join', '/status')
  window.sock.on('reconnect', function() {
    window.sock.emit('join', '/status')
  })
  ```
