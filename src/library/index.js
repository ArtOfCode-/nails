const Context = require('./context');

exports = module.exports = class Library {
  constructor({ config, params, req, res, requestHandler }) {
    Object.assign(this, { config, params, req, res, requestHandler });
    this.context = new Context(this);
    this.finalize = this.finalize.bind(this);
  }
  finalize() {
    if (!this.context.rendered) {
      this.res.writeHead(204);
      this.res.end();
    }
  }
};
