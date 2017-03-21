var http = require("http");

var handlers = require("./handlers.js");

exports.Server = function (config) {
  var handler = new handlers.Handler();
  var iface = config.get("server_interface");
  var port = config.get("server_port");

  this.run = () => {
    var server = http.createServer((req, res) => {
      console.log("[" + (new Date()).toISOString() + "] " + req.method + " " + req.url + " HTTP/" + req.httpVersion);

      var requestHandler = handler.getHandler(req);
      if (requestHandler) {
        requestHandler.call(this, req, (opts, content) => {
          if (typeof opts !== "object") {
            content = opts;
            opts = {};
          }

          opts = Object.assign(opts, {content});
          handlers.renderer(req, res, opts);
        });
      }
      else {
        var customErrorPage = handlers.getStaticContent("404.html");
        if (customErrorPage) {
          res.statusCode = 404;
          res.write(customErrorPage);
          res.end();
        }
        else {
          res.writeHead(404, 'Not Found');
          res.end();
        }
      }
    });

    server.listen(port, iface, () => {
      console.log("Nails server listening on " + iface + ":" + port);
    });
  };
};
