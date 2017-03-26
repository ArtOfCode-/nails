const chalk = require('chalk');
const debug = require('debug')('nails:router');

const methods = 'get head post put delete patch'.split(' ');

const bind = (function () {
  function bind(...keys) {
    keys.forEach(key => {
      this[key] = this[key].bind(this);
    });
  }
  return bind.call.bind(bind);
})();

module.exports = class Router {
  constructor() {
    this.scopes = [];
    this.routes = [];
    debug('creating router');
    methods.forEach(method => {
      this[method] = (path, to, options) => {
        if (!to) {
          to = path.replace(/\//g, '.') || 'index';
        }
        if (this.scopes.length > 0) {
          to = `${this.scopes.join('.')}.${to}`;
        }
        if (typeof to === 'object' && !options) {
          options = to;
        } else {
          options = options || {};
          options.to = to;
        }
        return this.request(method, path, options);
      };
    });
    bind(this, ...methods, 'request', 'scope');
  }
  get _i() {
    return '  '.repeat(this.scopes.length);
  }
  static draw(f) {
    const router = new this();
    debug('drawing routes...');
    f.call(router, router);
    debug('drew', router.routes.length, 'routes.');
    return router.routes;
  }
  request(method, path, options) {
    method = method.toUpperCase();
    const url = `${this.scopes.length > 0 ? '/' : ''}${this.scopes.join('/')}${path.length ? '/' : ''}${path}`;
    const route = Object.assign({
      type: method,
      url
    }, options);
    this.routes.push(route);
    debug(this._i + 'created', method === 'GET' ? chalk.gray(method) : chalk.bold(method), 'route', chalk.underline(path) || chalk.gray('<root>'), 'to', chalk.bold(options.to));
    return route;
  }
  scope(scope, f) {
    debug(this._i + 'entering scope', chalk.underline(scope));
    this.scopes.push(scope);
    f.call(this, this);
    this.scopes.pop();
    debug(this._i + 'leaving scope', chalk.underline(scope));
  }
};
