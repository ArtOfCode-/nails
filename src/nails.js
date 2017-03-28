require('debug').names.push(/^nails:[^a-z]+$/);
require('debug').names.push(/^nails$/);

const path = require("path");
const debug = require('debug')('nails:init');
const Server = require("./server");
const createConfig = require("./config");
const Router = require("./router");

exports = module.exports = arg => {
  if (typeof arg !== "object") {
    arg = {
      appRoot: arg
    };
  }
  const {appRoot = path.dirname(require.main.filename) + '/app', start = true} = arg;
  debug('starting server at', appRoot);
  const config = createConfig(path.join(appRoot, "config"));
  config.appRoot = appRoot;
  const server = new Server(config);
  if (start) {
    server.run();
  }
  return server;
};
exports.Router = Router;
