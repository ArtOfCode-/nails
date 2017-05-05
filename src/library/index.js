'use strict';

const assert = require('assert');
const path = require('path');
const url = require('url');

const qs = require('qs');

const Handler = require('../handlers');
const debug = require('./util')('context');
const { bind } = require('./util');

const createCookies = require('./cookies');
const createStream = require('./stream');
const createAuth = require('./auth');
const Cache = require('./cache');

const S = {
  library: Symbol('library'),
  rendered: Symbol('rendered?'),
  doubleRender: Symbol('double render?'),
};

/**
 * Error thrown when a controller calls a rendering method multiple times
**/
class DoubleRenderError extends Error {
  /**
   * @param {string} message The error message
  **/
  /* istanbul ignore next */constructor(message) {
    super(message);
    this.name = 'DoubleRenderError';
  }
}

exports = module.exports = class Library {
  /**
   * @class Library
   * @private
   * @classdesc
   * The library handling the `context` instance passed to the controller
   * @param {Object} options The options
   * @param {Object} options.config The nails config object
   * @param {Object} options.params The params provided in the URL
   * @param {Request} options.req The HTTP request instance
   * @param {Response} options.res The HTTP response instance
   * @param {Object} options.requestHandler The request metadata object
  **/
  constructor({ config, params, req, res, requestHandler }) {
    Object.assign(this, { config, params, req, res, requestHandler });
    this.finalize = this.finalize.bind(this);
    this.finalizers = [];

    req.header = (name, value) => {
      if (value) {
        return res.setHeader(name, value);
      }
      return res.getHeader(name);
    };
    req.setHeader = res.setHeader.bind(res);
    req.getHeader = req.header.get = res.getHeader.bind(res);
    req.removeHeader = req.header.remove = req.header.del = res.removeHeader.bind(res);

    bind(this, 'render', 'redirect', 'static');
    req.render = this.render;
    req.redirect = this.redirect;
    req.static = this.static;
    Object.defineProperty(req, 'rendered', {
      get() {
        return this.rendered;
      },
    });

    const register = f => {
      this.finalizers.push(f);
    };

    /**
    * @member {Auth} auth
    * The HTTP authentication provided
    * @memberof Request
    * @instance
    **/
    /**
     * @member {Cookies} cookies
     * Cookies sent by the client
     * @memberof Request
     * @instance
    **/
    /**
     * @member {Object} params
     * The query params in the URL
     * @memberof Request
     * @instance
    **/
    /**
    * @member {Cache} cache
    * Control how other servers cache the response
    * @memberof Request
    * @instance
    **/

    [
      ['auth', createAuth],
      ['cookies', createCookies],
      ['params', () => params],
      ['query', () => qs.parse(url.parse(req.url).query)],
      ['stream', () => {
        const stream = createStream(res);
        stream.on('pipe', this[S.doubleRender].bind(this));
        return stream;
      }],
      ['cache', (...args) => new Cache(...args)],
    ].forEach(([key, create]) => {
      Object.defineProperty(req, key, {
        get: () => {
          const s = Symbol(key);
          // istanbul ignore else: it’s only caching; what could possibly go wrong?
          if (!this[s]) {
            this[s] = create(this, register);
          }
          return this[s];
        },
      });
    });
  }
  /**
   * Finalize the context and finish adding headers and
   * other metadata to the response
   * @function finalize
   * @memberof Library
   * @instance
  **/
  finalize() {
    this.finalizers.forEach(finalizer => {
      if (typeof finalizer === 'function') {
        finalizer(this);
      }
    });
    if (!this.rendered) {
      this.res.writeHead(204);
      this.res.end();
    }
  }

  /**
   * Render content to the user
   * @param {Object} [opts] The options
   * @param {string} [content] The HTML content to render
  **/
  render(opts, content) {
    this[S.doubleRender]();
    debug('rendering', this.requestHandler.action);
    if (!opts || typeof opts !== 'object') {
      content = opts;
      opts = {};
    }
    Object.assign(opts, { content, route: this.requestHandler });
    Handler.renderer(this.req, this.res, opts);
  }
  /**
   * Redirect to the specified location
   * @param {(Object|string)} to The location to redirect to.
   *
   * If `to` is a string, redirect to that path/URL
   * If `to` is an object with a `back` key, redirect to the previous page,
   * or the value of the `back` key if the referrer isn’t present.
  **/
  redirect(to) {
    this[S.doubleRender]();
    const res = this.res;
    if (typeof to === 'object') {
      if (to.back) {
        assert.equal(typeof to.back, 'string', `typeof ${require('util').inspect(to.back, { depth: null })} was "${typeof to.back}", but it was supposed to be "string."`);
        to = this.req.headers.referer /* [sic] */ || to.back;
      }
    }
    res.writeHead(302, {
      location: to,
      'Turbolinks-Location': to,
    });
    res.end();
  }
  /**
   * Get the path to a static file
   * @param {...string} components The path components to join together
   * @returns {string} The absolute path to the static file
  **/
  static(...components) {
    return path.join(this.config.appRoot, 'static', ...components);
  }

  /**
   * Throws an error if called more than once.
   * @private
  **/
  [S.doubleRender]() {
    if (this[S.rendered]) {
      throw new DoubleRenderError('Already rendered ' + this[S.rendered]);
    }
    this[S.rendered] = new Error().stack;
  }
  /**
   * @returns {boolean} Has the controller rendered its view?
  **/
  get rendered() {
    return Boolean(this[S.rendered]);
  }
};
