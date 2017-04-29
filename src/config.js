const debug = require('./util')('config');

/**
 * @function createConfig
 * @description
 * Load the config from the specified path
 * @param {string} file The path to the config file
 * @returns {Object} the loaded object
**/
exports = module.exports = file => {
  let json;
  debug('loading config at', file);
  try {
    json = require(file);
    debug('loaded config');
  } catch (err) {
    /* istanbul ignore next */
    if (err.code !== 'MODULE_NOT_FOUND') {
      /* istanbul ignore next */
      throw err;
    }
    /* istanbul ignore next */
    throw new ReferenceError(`File ${file} doesn't exist: can't load config`);
  }
  return json;
  /* If special behavior is needed:
  return new Proxy(json, {
    get(target, property) {
      return target[property] || null;
    }
  });
  */
};
