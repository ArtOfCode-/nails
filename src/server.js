const http = require("http");

const chalk = require('chalk');
const socket = require('socket.io');

const initSocket = require('./ws');
const Handler = require("./handlers");
const Library = require("./library");

const { createDebug, warn, log } = require('./util');

const debug = createDebug('server');

exports = module.exports = class Server {
  constructor(config) {
    this.handler = new Handler(config);
    this.config = config;
  }
  /* istanbul ignore next */run() {
    this.handler.ready.then(this._run.bind(this));
  }
  /* istanbul ignore next */_run() {
    debug('starting server...');
    const iface = this.config.server_interface;
    const port = this.config.server_port;
    this.server = http.createServer(this._handleRequest.bind(this));

    this.io = socket(this.server, Object.assign({
    }, this.config.socketOptions));
    initSocket(this.io, this.handler);
    this.server.listen(port, iface, () => {
      log('Listening on', `${iface}:${port}`);
    });
  }
  _handleRequest(req, res) {
    log(req.method, chalk.underline(req.url), `HTTP/${req.httpVersion}`);

    const handler = this.handler.getHandler(req);
    if (handler) {
      const { route: requestHandler, params } = handler;
      const library = new Library({ config: this.config, params, req, res });
      const prom = requestHandler.method.call(library.context, req);
      Promise.resolve(prom).then(() => {
        let opts = library.requestData;

        // istanbul ignore else
        if (opts != null) {
          if (opts.redirect_to) {
            res.writeHead(302, {
              location: opts.redirect_to,
              'Turbolinks-Location': opts.redirect_to
            });
            res.end();
          }
          else {
            opts = Object.assign(opts, { route: requestHandler });
            Handler.renderer(req, res, opts);
          }
        }
      }).catch(warn);
    }
    else {
      Handler.getStaticContent("404.html", this.config).then(customErrorPage => {
        if (customErrorPage) {
          res.statusCode = 404;
          Handler.renderer(req, res, {
            routes: this.handler.routes,
            content: customErrorPage
          });
        }
        else {
          Handler.renderer(req, res, {
            status: 404,
            text: 'Not Found'
          });
        }
        log('404 at', req.url);
      }).catch(warn);
    }
  }
};
