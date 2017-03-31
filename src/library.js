const debug = require('debug')('nails:library');

const S = {
  library: Symbol('library')
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
}

exports = module.exports = class Library {
  constructor() {
    this.requestData = {};
    this.context = new Context(this);
  }
};
