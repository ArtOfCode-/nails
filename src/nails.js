require('debug').names.push(/^nails:[^a-z]+$/);
require('debug').names.push(/^nails$/);

const path = require("path");
const debug = require('debug')('nails:init');
const Server = require("./server");
const createConfig = require("./config");
const Router = require("./router");

exports = module.exports = (appRoot = path.dirname(require.main.filename) + '/app') => {
  debug('starting server at', appRoot);
  const config = createConfig(path.join(appRoot, "config"));
  config.appRoot = appRoot;
  new Server(config).run();
};
exports.Router = Router;
