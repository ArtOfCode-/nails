const path = require("path");
const Server = require("./server");
const createConfig = require("./config");

exports.nails = (appRoot = path.dirname(require.main.filename)) => {
  const config = createConfig(path.join(appRoot, "config"));
  config.appRoot = appRoot;
  new Server(config).run();
};
