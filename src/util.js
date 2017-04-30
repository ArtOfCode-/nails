'use strict';

const _ = require('lodash');

const _createDebug = require('debug');

const createDebug = (...args) => augment(_createDebug(...args));
/**
 * Augment a [`debug`](https://github.com/visionmedia/debug) instance
 * @param {debug} debug The debug instance
 * @returns {debug} The debug instance
 * @private
**/
function augment(debug) {
  /**
   * Create a child `debug` instance
   * @param {...string} ns The namespaces to add to the child `debug` instance
   * @returns {debug} The child instance
   * @memberof debug
   * @instance
   * @private
  **/
  debug.child = function (...ns) {
    return createDebug(_(ns).filter().unshift(debug.namespace).join(':'));
  };
  return debug;
}
const log = createDebug('nails');
/**
 * Create an augmented-debug kit for a subdirectory of `src`
 * @param {...string} names The names of the directories between `src` and the caller
 * @returns {debug} The augmented debug instance
 * @private
**/
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
