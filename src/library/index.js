const Context = require('./context');

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
    this.context = new Context(this);
    this.finalize = this.finalize.bind(this);
    this.finalizers = [];
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
        finalizer(this.req, this.res, this.context);
      }
    });
    if (!this.context.rendered) {
      this.res.writeHead(204);
      this.res.end();
    }
  }
};
