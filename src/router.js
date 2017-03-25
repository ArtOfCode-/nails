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
  static draw(f) {
    const router = new this();
    f.call(router, router);
    return router.routes;
  }
  request(method, path, options) {
    const route = Object.assign({
      type: method.toUpperCase(),
      url: `${this.scopes.length > 0 ? '/' : ''}${this.scopes.join('/')}${path.length ? '/' : ''}${path}`
    }, options);
    this.routes.push(route);
    return route;
  }
  scope(scope, f) {
    this.scopes.push(scope);
    f.call(this, this);
    this.scopes.pop();
  }
};
