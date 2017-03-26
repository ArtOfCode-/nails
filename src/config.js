const debug = require('debug')('nails:config');

exports = module.exports = function createConfig(file) {
  let json;
  debug('loading config at', file);
  try {
    json = require(file);
    debug('loaded config');
  }
  catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
    throw new ReferenceError("File doesn't exist: can't load config");
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
