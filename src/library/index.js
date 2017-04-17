const Context = require('./context');

exports = module.exports = class Library {
  constructor({ config, params, req, res, requestHandler }) {
    Object.assign(this, { config, params, req, res, requestHandler });
    this.context = new Context(this);
    this.finalize = this.finalize.bind(this);
    this.finalizers = [];
  }
  finalize() {
    this.finalizers.forEach(finalizer => {
      if (typeof finalizer === 'function') {
        finalizer(this.req, this.res, this.context);
      }
    });
    if (!this.context.rendered) {
      this.res.writeHead(204);
      this.res.end();
    }
  }
};
