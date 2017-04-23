const moment = require('moment');

const S = {
  context: Symbol('context'),
  cache: Symbol('cache'),
  finalize: Symbol('finalize'),
};

/**
 * Class handling expiry of the response
**/
class Expires {
  /**
   * @param {Object} cache The cache manager to attach to
  **/
  constructor(cache) {
    this[S.cache] = cache;
  }
  /**
   * Set the response to expire after the given duration.
   * See {@link http://devdocs.io/moment/index#manipulating-add `moment#add()`} for parameter documentation
  **/
  in(...args) {
    if (typeof args[0] === 'number' && args.length === 1) {
      args = [
        {
          ms: args[0],
        },
      ];
    }
    this[S.cache].store = true;
    this[S.cache].expires_ = args;
  }
  /**
   * Set the response to expire immediately and not be cached.
  **/
  now() {
    this[S.cache].expires_ = null;
    this[S.cache].maxAge = null;
    this[S.cache].cache = false;
  }
}

/**
 * @class
 * @classdesc
 * Class handling caching
 * @name Cache
**/
exports = module.exports = class Cache {
  /**
   * @param {Context} context The context instance to attach to
   * @param {function} register The callback to add a listener for the end of the response
  **/
  constructor(context, register) {
    this[S.context] = context;
    register(this[S.finalize].bind(this));

    this.private = true;
    this.cache = true;
    this.store = false;
    this.maxAge = null;
    /**
     * @member {Expires} expires
     * @memberof Cache
    **/
    this.expires = new Expires(this);
  }
  /**
   * Cache the response forever (100 years)
  **/
  forever() {
    this.store = true;
    this.expires.in(100, 'years');
  }
  /**
   * @private
   * @param {Request} req The request
   * @param {Response} res The response
  **/
  [S.finalize](req, res) {
    const directives = [];
    const add = directives.push.bind(directives);
    if (this.cache) {
      add(this.private ? 'private' : 'public');
    } else {
      add('no-cache');
    }
    if (!this.store) {
      add('no-store');
    }
    if (this.maxAge) {
      add(`max-age=${Number(this.maxAge)}`);
    }
    if (this.expires_) {
      res.setHeader('expires', moment().add(...this.expires_).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]'));
    }

    res.setHeader('cache-control', directives.join(', '));
  }
};
