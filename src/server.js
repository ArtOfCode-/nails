'use strict';

const http = require('http');

const chalk = require('chalk');
const socket = require('socket.io');

const initSocket = require('./ws');
const Handler = require('./handlers');
const Library = require('./library');

const { createDebug, warn, log } = require('./util');

const debug = createDebug('server');

/**
 * HTTP Server handler
**/
class Server {
  /**
   * @param {Object} config The nails config
  **/
  constructor(config) {
    this.handler = new Handler(config);
    this.config = config;
  }
  /**
   * Start the HTTP server when everything is ready
  **/
  /* istanbul ignore next */run() {
    this.handler.ready.then(this._run.bind(this));
  }
  /**
   * Start the HTTP server for real
  **/
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
  /**
   * Handle an incoming request
   * @param {Request} req The HTTP Request
   * @param {Response} res The HTTP Response
  **/
  _handleRequest(req, res) {
    log(req.method, chalk.underline(req.url), `HTTP/${req.httpVersion}`);

    const handler = this.handler.getHandler(req);
    if (handler) {
      const { route: requestHandler, params } = handler;
      const library = new Library({ config: this.config, params, req, res, requestHandler });
      const prom = requestHandler.method.call(library.context, req);
      Promise.resolve(prom).then(library.finalize).catch(warn);
    } else {
      Handler.getStaticContent('404.html', this.config).then(customErrorPage => {
        if (customErrorPage) {
          res.statusCode = 404;
          Handler.renderer(req, res, {
            routes: this.handler.routes,
            content: customErrorPage,
          });
        } else {
          Handler.renderer(req, res, {
            status: 404,
            text: 'Not Found',
          });
        }
        log('404 at', req.url);
      }).catch(warn);
    }
  }
}

exports = module.exports = Server;
