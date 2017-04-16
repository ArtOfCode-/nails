require('debug').names.push(/^nails:[^a-z]+$/);
require('debug').names.push(/^nails$/);

const path = require('path');
const { randomBytes } = require('crypto');

const _ = require('lodash');

const debug = require('./util')('init');
const Server = require('./server');
const createConfig = require('./config');

// We ❤️ escaping
[_.templateSettings.interpolate, _.templateSettings.escape] = [_.templateSettings.escape, _.templateSettings.interpolate];

function lazy(key, get) {
  const uninitialized = {};
  let _val = uninitialized;
  Object.defineProperty(exports, key, {
    get() {
      /* istanbul ignore else */
      if (_val === uninitialized) {
        _val = get();
      }
      return _val;
    },
  });
}

exports = module.exports = arg => {
  /* istanbul ignore if: only for backwards compatibility */
  if (typeof arg !== 'object') {
    arg = {
      appRoot: arg,
    };
  }
  _.defaults(arg, {
    appRoot: path.dirname(require.main.filename) + '/app',
    appName: '',
    start: true,
  });
  arg.appName = arg.appName || path.basename(path.dirname(arg.appRoot));

  const { appRoot, appName, start } = arg;
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
exports.genKey = (length = 50) => {
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
