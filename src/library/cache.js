const moment = require('moment');

const S = {
  context: Symbol('context'),
  cache: Symbol('cache'),
};

class Expires {
  constructor(cache) {
    this[S.cache] = cache;
  }
  in(...args) {
    if (typeof args[0] === 'number') {
      args = [
        {
          ms: args[0],
        },
      ];
    }
    this[S.cache].maxAge = moment().add(...args);
  }
  now() {
    this[S.cache].maxAge = null;
    this[S.cache].cache = false;
  }
}

exports = module.exports = class Cache {
  constructor(context) {
    this[S.context] = context;

    this.private = true;
    this.cache = true;
    this.store = false;
    this.maxAge = null;
    this.expires = new Expires(this);
  }
  forever() {
    this.expires.in(moment.duration(100, 'years'));
  }
  setHeaders(context) {
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
    if (this.expires) {
      context.header('expires', moment(this.expires).utc().format('ddd, DD MMM YYYY HH:mm:ss GMT'));
    }

    return directives.join(', ');
  }
};
