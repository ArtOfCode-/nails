const http = require("http");
const Handler = require("./handlers");
const library = require("./library");

exports = module.exports = class Server {
  constructor(config) {
    this.handler = new Handler(config);
    this.config = config;
  }
  run() {
    const iface = this.config.get("server_interface");
    const port = this.config.get("server_port");
    const server = http.createServer((req, res) => {
      console.log("[" + (new Date()).toISOString() + "] " + req.method + " " + req.url + " HTTP/" + req.httpVersion);

      const requestHandler = this.handler.getHandler(req);
      if (requestHandler) {
        library.resetRequestData();
        requestHandler.bind(library)(req);
        let opts = library.getRequestData();

        if (opts != null) {
          if (opts.redirect_to) {
            res.writeHead(302, {
              location: opts.redirect_to
            });
            res.end();
          }
          else {
            opts = Object.assign(opts, {routes: this.handler.routes});
            Handler.renderer(req, res, opts);
          }
        }
      }
      else {
        const customErrorPage = Handler.getStaticContent("404.html", this.config);
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
  }
};
