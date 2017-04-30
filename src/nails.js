'use strict';

/**
 * Nails, a Rails clone in Node
 * @module nails
**/

require('debug').names.push(/^nails:[^a-z]+$/);
require('debug').names.push(/^nails$/);

const path = require('path');
const { randomBytes } = require('crypto');

const templateSettings = require('lodash.templatesettings');
const defaults = require('lodash.defaults');

const debug = require('./util')('init');
const Server = require('./server');
const createConfig = require('./config');

// We ❤️ escaping
[templateSettings.interpolate, templateSettings.escape] = [templateSettings.escape, templateSettings.interpolate];

/**
 * Define a lazy property on `exports` that
 * retrieves the value when accessed
 * the first time
 * @private
 * @param {string} key The key to add
 * @param {Function} get The function to generate the value
**/
function lazy(key, get) {
  const uninitialized = {};
  let _val = uninitialized;
  Object.defineProperty(exports, key, {
    get() {
      if (_val === uninitialized) {
        _val = get();
      }
      return _val;
    },
  });
}

/**
 * Call this function to start your Nails app.
 * @param {(Object|string)} options The options for Nails
 * @returns {Server} The server instance
**/
exports = module.exports = options => {
  /* istanbul ignore if: only for backwards compatibility */
  if (typeof options !== 'object') {
    options = {
      appRoot: options,
    };
  }
  defaults(options, {
    appRoot: path.dirname(require.main.filename) + '/app',
    appName: '',
    start: true,
  });
  options.appName = options.appName || path.basename(path.dirname(options.appRoot));

  const { appRoot, appName, start } = options;
  debug('starting server for', appName, 'at', appRoot);
  const config = createConfig(appRoot + '/config');
  Object.assign(config, { appRoot, appName });
  const server = new Server(config);
  /* istanbul ignore if: we don’t actually start the server yet */
  if (start) {
    server.run();
  }
  return server;
};
/**
 * Generate a (hopefully) cryptographically secure random secret key
 * @param {number} length The length of key to generate. Default: 50
 * @returns {string} The random key
**/
exports.genKey = (length = 50) => {
  // Based on Django’s implementation
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';
  const bytes = randomBytes(length);
  let value = '';
  for (const byte of bytes) {
    value += chars[byte % chars.length];
  }
  return value;
};
lazy('Router', () => require('./router'));
lazy('Channel', () => require('./ws/channel'));
lazy('Connection', () => require('./ws/connection'));
