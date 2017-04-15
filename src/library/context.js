const assert = require('assert');
const crypto = require('crypto');
const path = require('path');
const url = require('url');
const fs = require('fs');

const auth = require('basic-auth');
const Cookies = require('cookies');
const chalk = require('chalk');

const Handler = require('../handlers');
const { warn } = require('../util');
const debug = require('../util')('library', 'context');

const S = {
  library: Symbol('library'),
  params: Symbol('params'),
  query: Symbol('query'),
  auth: Symbol('auth'),
  rendered: Symbol('rendered?'),
  doubleRender: Symbol('double render?'),
};

class DoubleRenderError extends Error {
  /* istanbul ignore next */constructor(message) {
    super(message);
    this.name = 'DoubleRenderError';
  }
}

module.exports = class Context {
  constructor(library) {
    this[S.library] = library;
    this[S.rendered] = false;

    const res = library.res;
    this.setHeader = this.header = res.setHeader.bind(res);
    this.getHeader = this.header.get = res.getHeader.bind(res);
    this.removeHeader = this.header.remove = this.header.del = res.removeHeader.bind(res);
    this.requestHeaders = this.headers = library.req.headers;
    this._initStreaming();
    this._initCookies();
  }

  _initStreaming() {
    const res = this[S.library].res;
    const keys = Object.keys(require('events').prototype).concat(Object.keys(require('stream').Writable.prototype));
    for (const key of keys) {
      if (key[0] === '_' || ['domain'].includes(key) || !(key in res)) {
        continue;
      }
      // istanbul ignore else
      if (typeof res[key] === 'function') {
        this.stream[key] = res[key].bind(res);
      } else {
        warn(chalk.bold(key), 'key not processed in context. Value:', res[key]);
      }
    }
    this.stream.on('pipe', this[S.doubleRender].bind(this));
  }
  stream(arg) {
    if (arg.data) {
      const { data, encoding = 'utf-8' } = arg;
      return new Promise((resolve, reject) => this.stream.write(data, encoding, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }));
    } else if (arg.path) {
      const { path, encoding = 'utf-8', options = {} } = arg;
      const stream = fs.createReadStream(path, Object.assign({
        encoding,
      }, options));
      stream.pipe(this.stream);
      return Promise.resolve(stream);
    }
  }

  _initCookies() {
    const library = this[S.library];
    this.cookies = new Cookies(library.req, library.res, {
      keys: library.config.keys || [library.config.key],
    });
    const set = this.cookies.set.bind(this.cookies);
    const get = this.cookies.get.bind(this.cookies);
    this.cookies.set = (k, v, opts) => set(k, JSON.stringify(v), opts);
    this.cookies.get = this._getCookie.bind(this, get);
    this.cookies.delete = key => {
      set(key, null);
      set(key + '.sig', null);
    };
  }
  _getCookie(get, ...args) {
    const str = get(...args);
    // istanbul ignore if: this is only for compatibility with the library itself
    if (args[0].endsWith('.sig')) {
      return str;
    }
    if (str == null || str === 'undefined') {
      return;
    }
    return JSON.parse(str);
  }

  get params() {
    this[S.params] = this[S.params] || Object.freeze(this[S.library].params);
    return this[S.params];
  }
  get query() {
    this[S.query] = this[S.query] || Object.freeze(url.parse(this[S.library].req.url, true).query);
    return this[S.query];
  }
  get auth() {
    this[S.auth] = this[S.auth] || Object.freeze(Object.assign(auth(this[S.library].req) || { invalid: true }, {
      check(user, pass) {
        if (this.invalid) {
          return false;
        }
        let userOK = user.length === this.name.length;
        userOK = userOK && crypto.timingSafeEqual(Buffer.from(user), Buffer.from(this.name));
        let passOK = pass.length === this.pass.length;
        passOK = passOK && crypto.timingSafeEqual(Buffer.from(pass), Buffer.from(this.pass));
        return userOK && passOK; // Avoid short-circuit-based timing attack
      },
      enable: ({ realm = this[S.library].config.appName }) => {
        this.header('WWW-Authenticate', `Basic realm="${String(realm).replace('"', '\\"')}"`);
      },
    }));
    return this[S.auth];
  }

  render(opts, content) {
    this[S.doubleRender]();
    debug('rendering', this[S.library].requestHandler.action);
    if (typeof opts !== 'object') {
      content = opts;
      opts = {};
    }
    Object.assign(opts, { content, route: this[S.library].requestHandler });
    Handler.renderer(this[S.library].req, this[S.library].res, opts);
  }
  redirect(to) {
    this[S.doubleRender]();
    const res = this[S.library].res;
    if (typeof to === 'object') {
      if (to.back) {
        assert.equal(typeof to.back, 'string');
        if (this[S.library].req.headers.referer) { // [sic]
          to = this[S.library].req.headers.referer;
        } else {
          to = to.back;
        }
      }
    }
    res.writeHead(302, {
      location: to,
      'Turbolinks-Location': to,
    });
    res.end();
  }
  static(...components) {
    return path.join(this[S.library].config.appRoot, 'static', ...components);
  }

  [S.doubleRender]() {
    if (this[S.rendered]) {
      /* istanbul ignore next */
      throw new DoubleRenderError('Already rendered ' + this[S.rendered]);
    }
    this[S.rendered] = new Error().stack;
  }
  get rendered() {
    return this[S.rendered];
  }
};
