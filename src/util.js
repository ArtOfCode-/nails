const _createDebug = require('debug');

const createDebug = (...args) => augment(_createDebug(...args));
function augment(debug) {
  debug.child = function (...ns) {
    return createDebug(`${debug.namespace}:${ns.join(':')}`);
  };
  return debug;
}
const log = createDebug('nails');
exports = module.exports = log.child;
exports.log = log;
exports.createDebug = exports;
exports.warn = log.child('WARNING');
