const moment = require('moment');

const S = {
  context: Symbol('context'),
  cache: Symbol('cache'),
  finalize: Symbol('finalize'),
};

class Expires {
  constructor(cache) {
    this[S.cache] = cache;
  }
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
  now() {
    this[S.cache].expires_ = null;
    this[S.cache].maxAge = null;
    this[S.cache].cache = false;
  }
}

exports = module.exports = class Cache {
  constructor(context, register) {
    this[S.context] = context;
    register(this[S.finalize].bind(this));

    this.private = true;
    this.cache = true;
    this.store = false;
    this.maxAge = null;
    this.expires = new Expires(this);
  }
  forever() {
    this.store = true;
    this.expires.in(100, 'years');
  }
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
