const debug = require('debug')('nails:library');

const Cookies = require('cookies');

const S = {
  library: Symbol('library'),
  params: Symbol('params')
};

class Context {
  constructor(library, { req, res }) {
    this[S.library] = library;

    this.cookies = new Cookies(req, res, {
      keys: library.config.keys || [library.config.key]
    });
    const set = this.cookies.set.bind(this.cookies);
    const get = this.cookies.get.bind(this.cookies);
    this.cookies.set = (k, v, opts) => set(k, JSON.stringify(v), opts);
    this.cookies.get = (...args) => {
      const str = get(...args);
      if (args[0].endsWith('.sig')) {
        return str;
      }
      // eslint-disable-next-line eqeqeq
      if (str == undefined || str === 'undefined') {
        return;
      }
      return JSON.parse(str);
    };
    this.cookies.delete = key => {
      set(key, null);
      set(key + '.sig', null);
    };
  }

  render(opts, content) {
    debug('rendering'); // TODO: get controller name
    if (typeof opts !== "object") {
      content = opts;
      opts = {};
    }

    this[S.library].requestData = Object.assign(opts, { content });
  }
  redirect(to) {
    this[S.library].requestData.redirect_to = to; // eslint-disable-line camelcase
  }
  get params() {
    this[S.params] = this[S.params] || Object.freeze(this[S.library].params);
    return this[S.params];
  }
}

exports = module.exports = class Library {
  constructor({ config, params, req, res }) {
    this.requestData = {};
    this.params = params;
    this.config = config;
    this.context = new Context(this, { req, res });
  }
};
