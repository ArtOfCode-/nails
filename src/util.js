const _ = require('lodash');

const _createDebug = require('debug');

const createDebug = (...args) => augment(_createDebug(...args));
function augment(debug) {
  debug.child = function (...ns) {
    return createDebug(_(ns).filter().unshift(debug.namespace).join(':'));
  };
  return debug;
}
const log = createDebug('nails');
const kit = (...names) => {
  const child = log.child(...names);
  return Object.assign(child.child, {
    log: child,
    warn: log.child('WARNING', ...names),
    createDebug: child.child,
    kit: kit.bind(null, ...names),
  });
};

module.exports = kit();
