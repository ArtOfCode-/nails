var http = require("http");
var handlers = require("./handlers.js");
var library = require("./library.js");

exports.Server = function (config) {
  var handler = new handlers.Handler(config);
  var iface = config.get("server_interface");
  var port = config.get("server_port");

  this.run = () => {
    var server = http.createServer((req, res) => {
      console.log("[" + (new Date()).toISOString() + "] " + req.method + " " + req.url + " HTTP/" + req.httpVersion);

      var requestHandler = handler.getHandler(req);
      if (requestHandler) {
        library.resetRequestData();
        requestHandler.bind(library)(req);
        var opts = library.getRequestData();

        if (opts !== null) {
          if (opts.redirect_to) {
            res.writeHead(302, {
              location: opts.redirect_to
            });
            res.end();
          }
          else {
            opts = Object.assign(opts, {routes: handler.routes});
            handlers.renderer(req, res, opts);
          }
        }
      }
      else {
        var customErrorPage = handlers.getStaticContent("404.html", config);
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
