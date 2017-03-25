const path = require("path");
const Server = require("./server");
const createConfig = require("./config");
const Router = require("./router");

exports = module.exports = (appRoot = path.dirname(require.main.filename) + '/app') => {
  const config = createConfig(path.join(appRoot, "config"));
  config.appRoot = appRoot;
  new Server(config).run();
};
exports.Router = Router;
