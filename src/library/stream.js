const fs = require('fs');

const chalk = require('chalk');
const debug = require('./util')('stream');

/**
 * @function stream
 * @description
 * Stream something to the response.
 * This function is also a writable stream, so streams
 * can be piped into it:
 * `myStream.pipe(this.stream)`
 * @param {Object} options The options
 * @param {string} [options.path] The path to a file to stream into the response
 * @memberof Context
 * @instance
**/

module.exports = res => {
  const stream = arg => {
    if (arg.path) {
      const { path, encoding = 'utf-8', options = {} } = arg;
      const fileStream = fs.createReadStream(path, Object.assign({
        encoding,
      }, options));
      fileStream.pipe(stream);
      return Promise.resolve(fileStream);
    }
  };
  const keys = Object.keys(require('events').prototype).concat(Object.keys(require('stream').Writable.prototype));
  for (const key of keys) {
    if (key[0] === '_' || ['domain'].includes(key) || !(key in res)) {
      continue;
    }
    /* istanbul ignore else */
    if (typeof res[key] === 'function') {
      stream[key] = res[key].bind(res);
    } else {
      debug(chalk.bold(key), 'key not processed in context. Value:', res[key]);
    }
  }
  return stream;
};
