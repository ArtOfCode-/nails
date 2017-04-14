const assert = require('assert');
const debug = require('debug')('nails:library');

const Cookies = require('cookies');

const Handler = require("./handlers");

const S = {
  library: Symbol('library'),
  params: Symbol('params'),
  rendered: Symbol('rendered?'),
  doubleRender: Symbol('double render?'),
};

class DoubleRenderError extends Error {
  /* istanbul ignore next */constructor(message) {
    super(message);
    this.name = 'DoubleRenderError';
  }
}

class Context {
  constructor(library, { req, res }) {
    this[S.library] = library;
    this[S.rendered] = false;

    this.cookies = new Cookies(req, res, {
      keys: library.config.keys || [library.config.key]
    });
    const set = this.cookies.set.bind(this.cookies);
    const get = this.cookies.get.bind(this.cookies);
    this.cookies.set = (k, v, opts) => set(k, JSON.stringify(v), opts);
    this.cookies.get = (...args) => {
      const str = get(...args);
      // istanbul ignore if: this is only for compatibility with the library itself
      if (args[0].endsWith('.sig')) {
        return str;
      }
      // eslint-disable-next-line eqeqeq
      if (str == undefined || str === 'undefined') {
        return;
      }
      // istanbul ignore next: there’s no way AFAIK to send cookies with the request.
      return JSON.parse(str);
    };
    // istanbul ignore next: see above
    this.cookies.delete = key => {
      set(key, null);
      set(key + '.sig', null);
    };
  }

  [S.doubleRender]() {
    if (this[S.rendered]) {
      /* istanbul ignore next */
      throw new DoubleRenderError('Already rendered ' + require('util').inspect(this[S.library].requestData, { depth: null }));
    }
    this[S.rendered] = true;
  }
  render(opts, content) {
    this[S.doubleRender]();
    debug('rendering', this[S.library].requestHandler.action);
    if (typeof opts !== "object") {
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
      'Turbolinks-Location': to
    });
    res.end();
  }
  get params() {
    this[S.params] = this[S.params] || Object.freeze(this[S.library].params);
    return this[S.params];
  }
}

exports = module.exports = class Library {
  constructor({ config, params, req, res, requestHandler }) {
    Object.assign(this, { config, params, req, res, requestHandler });
    this.context = new Context(this, { req, res });
    this.finalize = this.finalize.bind(this);
  }
  finalize() {
    if (!this.context[S.rendered]) {
      this.res.writeHead(204);
      this.res.end();
    }
  }
};
