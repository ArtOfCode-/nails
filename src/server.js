const http = require("http");
const Handler = require("./handlers");
const Library = require("./library");

exports = module.exports = class Server {
  constructor(config) {
    this.handler = new Handler(config);
    this.config = config;
  }
  run() {
    this.handler.ready.then(this._run.bind(this));
  }
  _run() {
    const iface = this.config.server_interface;
    const port = this.config.server_port;
    const server = http.createServer((req, res) => {
      console.log("[" + (new Date()).toISOString() + "] " + req.method + " " + req.url + " HTTP/" + req.httpVersion);

      const requestHandler = this.handler.getHandler(req);
      if (requestHandler) {
        const library = new Library();
        const prom = requestHandler.call(library.context, req);
        Promise.resolve(prom).then(() => {
          let opts = library.requestData;

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
        });
      }
      else {
        Handler.getStaticContent("404.html", this.config).then(customErrorPage => {
          if (customErrorPage) {
            res.statusCode = 404;
            res.write(customErrorPage);
            res.end();
          }
          else {
            res.writeHead(404, 'Not Found');
            res.end();
          }
        });
      }
    });

    server.listen(port, iface, () => {
      console.log("Nails server listening on " + iface + ":" + port);
    });
  }
};
