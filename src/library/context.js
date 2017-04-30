'use strict';

const assert = require('assert');
const path = require('path');
const url = require('url');

const _ = require('lodash');
const qs = require('qs');

const Handler = require('../handlers');
const debug = require('./util')('context');

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

/**
 * The `this` value available in controllers
**/
class Context {
  /**
   * @param {Library} library The library to attach to
  **/
  constructor(library) {
    this[S.library] = library;
    this[S.rendered] = false;

    const { req, res } = library;
    this.header = (name, value) => {
      if (value) {
        return res.setHeader(name, value);
      }
      return res.getHeader(name);
    };
    this.setHeader = res.setHeader.bind(res);
    this.getHeader = this.header.get = res.getHeader.bind(res);
    this.removeHeader = this.header.remove = this.header.del = res.removeHeader.bind(res);
    this.requestHeaders = this.headers = req.headers;

    const register = f => {
      library.finalizers.push(f);
    };

    /**
    * @member {Auth} auth
    * The HTTP authentication provided
    * @memberof Context
    * @instance
    **/
    /**
     * @member {Cookies} cookies
     * Cookies sent by the client
     * @memberof Context
     * @instance
    **/
    /**
     * @member {Object} params
     * The query params in the URL
     * @memberof Context
     * @instance
    **/
    /**
    * @member {Cache} cache
    * Control how other servers cache the response
    * @memberof Context
    * @instance
    **/

    [
      ['auth', () => createAuth(library, this.header)],
      ['cookies', () => createCookies(library)],
      ['params', () => library.params],
      ['query', () => qs.parse(url.parse(req.url).query)],
      ['stream', () => {
        const stream = createStream(res);
        stream.on('pipe', this[S.doubleRender].bind(this));
        return stream;
      }],
      ['cache', () => new Cache(this, register)],
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

  /**
   * Render content to the user
   * @param {Object} [opts] The options
   * @param {string} [content] The HTML content to render
  **/
  render(opts, content) {
    this[S.doubleRender]();
    debug('rendering', this[S.library].requestHandler.action);
    if (!opts || typeof opts !== 'object') {
      content = opts;
      opts = {};
    }
    Object.assign(opts, { content, route: this[S.library].requestHandler });
    Handler.renderer(this[S.library].req, this[S.library].res, opts);
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
    const res = this[S.library].res;
    if (typeof to === 'object') {
      if (to.back) {
        assert.equal(typeof to.back, 'string', `typeof ${require('util').inspect(to.back, { depth: null })} was "${typeof to.back}", but it was supposed to be "string."`);
        to = this[S.library].req.headers.referer /* [sic] */ || to.back;
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
    return path.join(this[S.library].config.appRoot, 'static', ...components);
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
}

module.exports = Context;
