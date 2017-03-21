var http = require("http");

var handlers = require("./handlers.js");

exports.Server = config => {
  var handler = new handlers.Handler();
  var iface = config.get("server_interface");
  var port = config.get("server_port");

  this.run = () => {
    var server = http.createServer((req, res) => {
      console.log("[" + (new Date()).toISOString() + "] " + req.method + " " + req.url + " HTTP/" + req.httpVersion);

      var requestHandler = handler.getHandler(req);
      if (requestHandler) {
        requestHandler.call(this, req, res);
      }
    });

    server.listen(port, iface, () => {
      console.log("Nails server listening on " + iface + ":" + port);
    });
  };
};
