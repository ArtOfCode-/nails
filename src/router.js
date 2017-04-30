'use strict';

const chalk = require('chalk');
const debug = require('./util')('router');

const methods = 'get head post put delete patch'.split(' ');

const bind = (function () {
  /** @private */
  function bind(...keys) {
    keys.forEach(key => {
      this[key] = this[key].bind(this);
    });
  }
  return bind.call.bind(bind);
})();

/**
 * The routing helper
 * @memberof module:nails
**/
class Router {
  /**
   * Create the router
  **/
  constructor() {
    this.scopes = [];
    this.routes = [];
    debug('creating router');
    methods.forEach(method => {
      this[method] = this.request.bind(this, method);
    });
    bind(this, ...methods, 'request', 'ws');
    bind(this, 'scope', '_url', 'debug');
  }

  /**
   * Custom `debug` handler that indents with each scope change.
   * @private
  **/
  debug(...args) {
    if (this.scopes.length === 0) {
      debug(...args);
    } else {
      debug('  '.repeat(this.scopes.length).slice(0, -1), ...args);
    }
  }

  /**
   * “Draw” the routes. This creates a new router,
   * passes it to the function, and returns the created routes.
   * @static
   * @param {Function} f The function to call to draw the routes.
   * @returns {Array} The created routes
  **/
  static draw(f) {
    const router = new this();
    router.debug('drawing routes...');
    f.call(router, router);
    router.debug('drew', router.routes.length, 'routes.');
    return router.routes;
  }

  /**
   * @func method
   * @memberof module:nails.Router
   * @instance
   * @description
   * `request()` with `method` prefilled as *method*
   * @param {string} path The path to match, matched using `path-to-regexp`
   * @param {?string} to The controller to call, represented as a string
   * @param {?object} options More values to include in the route
   * @returns {RouteJSON} The created route
   * @see {@link module:nails.Router#request}
  **/

  /**
   * Create a route for an HTTP request.
   * @param {string} method The HTTP verb to respond to
   * @param {string} path The path to match, matched using `path-to-regexp`
   * @param {?string} to The controller to call, represented as a string
   * @param {?object} options More values to include in the route
   * @returns {RouteJSON} The created route
  **/
  request(method, path, to, options) {
    options = this._processOptions(to, options);
    options.to = this._pathToJS(options.to, path);
    method = method.toUpperCase();
    const route = Object.assign({
      type: method,
      url: this._url(path),
    }, options);
    this.routes.push(route);
    this.debug('created', method === 'GET' ? chalk.gray(method) : chalk.bold(method), 'route', chalk.underline(path) || chalk.gray('<root>'), 'to', chalk.bold(options.to));
    return route;
  }
  /**
   * @param {...string} scopes The scopes to push onto the router
   * @param {function(Router)} f The callback to call with the router
  **/
  scope(...args) {
    const scopes = args.slice(0, -1);
    const f = args[args.length - 1];
    this.debug('entering scope', chalk.underline(scopes.join('/')));
    this.scopes = this.scopes.concat(scopes);
    f.call(this, this);
    this.scopes.length -= scopes.length;
    this.debug('leaving scope', chalk.underline(scopes.join('/')));
  }

  /**
   * @param {string} path The path to match
   * @param {string} [to] The channel to call
   * @param {Object} [options] Additional options for the route
   * @returns {RouteJSON} The route
  **/
  ws(path, to, options) {
    options = this._processOptions(to, options);
    options.to = this._pathToJS(options.to, path);
    const route = Object.assign({
      ws: true,
      url: this._url(path),
    }, options);
    this.routes.push(route);
    this.debug('created websocket channel', chalk.underline(path) || chalk.gray('<root>'), 'to', chalk.bold(options.to));
    return route;
  }

  /**
   * Handle the optional `to` and `options` arguments to routing methods
   * @param {string} [to] The `to` parameter
   * @param {Object} [options] The `options` parameter
   * @returns {Object} The options
   * @private
  **/
  _processOptions(to, options) {
    if (typeof to === 'object' && !options) {
      options = to;
    } else {
      options = options || {};
      options.to = to;
    }
    return options;
  }
  /**
   * Create the final `path` param by prepending the scopes
   * @param {string} path The initial path
   * @returns {string} The actual path
   * @private
  **/
  _url(path) {
    return `${this.scopes.length > 0 ? '/' : ''}${this.scopes.join('/')}${path.length > 0 && path !== '/' ? '/' : ''}${path}` || '/';
  }
  /**
   * Convert the path to a JS channel/controller location
   * @param {string} name The `to` parameter
   * @param {string} path The path that the route responds to
   * @returns {string} The final path
   * @private
  **/
  _pathToJS(name, path) {
    if (path.endsWith('/')) {
      path += 'index';
    }
    if (!name || name.length === 0) {
      name = path.replace(/^\//, '').replace(/\//g, '.');
    }
    if (this.scopes.length > 0) {
      if (name) {
        return `${this.scopes.join('.')}.${name}`;
      }
      return this.scopes.join('.');
    }
    return name;
  }
}
exports = module.exports = Router;
