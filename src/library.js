const debug = require('debug')('nails:library');

const S = {
  library: Symbol('library'),
  params: Symbol('params')
};

class Context {
  constructor(library) {
    this[S.library] = library;
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
  constructor({ params }) {
    this.requestData = {};
    this.params = params;
    this.context = new Context(this);
  }
};
