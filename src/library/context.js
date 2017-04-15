const assert = require('assert');
const path = require('path');
const url = require('url');

const Handler = require('../handlers');
const createCookies = require('./cookies');
const createStream = require('./stream');
const createAuth = require('./auth');
const debug = require('./util')('context');

const S = {
  library: Symbol('library'),
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

    const { req, res } = library;
    this.setHeader = this.header = res.setHeader.bind(res);
    this.getHeader = this.header.get = res.getHeader.bind(res);
    this.removeHeader = this.header.remove = this.header.del = res.removeHeader.bind(res);
    this.requestHeaders = this.headers = req.headers;
    [
      ['auth', () => createAuth(library, this.header)],
      ['cookies', () => createCookies(library)],
      ['params', () => library.params],
      ['query', () => url.parse(req.url, true).query],
      ['stream', () => {
        const stream = createStream(res);
        stream.on('pipe', this[S.doubleRender].bind(this));
        return stream;
      }],
    ].forEach(([key, create]) => {
      Object.defineProperty(this, key, {
        get: () => {
          const s = Symbol(key);
          // istanbul ignore else: it’s only caching; what could possibly go wrong?
          if (!this[s]) {
            this[s] = create();
          }
          return this[s];
        },
      });
    });
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
      assert.equal(typeof to.back, 'string', `typeof ${require('util').inspect(to.back, { depth: null })} was "${typeof to.back}", but it was supposed to be "string."`);
      if (this[S.library].req.headers.referer) { // [sic]
        to = this[S.library].req.headers.referer;
      } else {
        to = to.back;
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
      throw new DoubleRenderError('Already rendered ' + this[S.rendered]);
    }
    this[S.rendered] = new Error().stack;
  }
  get rendered() {
    return Boolean(this[S.rendered]);
  }
};
