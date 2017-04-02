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

exports = module.exports = class Router {
  constructor() {
    this.scopes = [];
    this.routes = [];
    debug('creating router');
    methods.forEach(method => {
      this[method] = (path, to, options) => {
        if (typeof to === 'object' && !options) {
          options = to;
        } else {
          options = options || {};
          options.to = to;
        }
        return this.request(method, path, options);
      };
    });
    bind(this, ...methods, 'request');
    bind(this, 'scope', '_url');
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
    options.to = this._pathToJS(options.to, path);
    method = method.toUpperCase();
    const route = Object.assign({
      type: method,
      url: this._url(path)
    }, options);
    this.routes.push(route);
    debug(this._i + 'created', method === 'GET' ? chalk.gray(method) : chalk.bold(method), 'route', chalk.underline(path) || chalk.gray('<root>'), 'to', chalk.bold(options.to));
    return route;
  }
  scope(...args) {
    const scopes = args.slice(0, -1);
    const f = args[args.length - 1];
    debug(this._i + 'entering scope', chalk.underline(scopes.join('/')));
    this.scopes = this.scopes.concat(scopes);
    f.call(this, this);
    this.scopes.length -= scopes.length;
    debug(this._i + 'leaving scope', chalk.underline(scopes.join('/')));
  }
  _url(path) {
    return `${this.scopes.length > 0 ? '/' : ''}${this.scopes.join('/')}${path.length ? '/' : ''}${path}` || '/';
  }
  _pathToJS(name, path) {
    if (!name) {
      name = path.replace(/\//g, '.') || 'index';
    }
    if (this.scopes.length > 0) {
      name = `${this.scopes.join('.')}.${name}`;
    }
    return name;
  }
};
