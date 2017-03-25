const path = require("path");
const Server = require("./server");
const Config = require("./config");

exports.nails = (appRoot = path.dirname(require.main.filename)) => {
  const cfg = new Config(path.join(appRoot, "config"));
  cfg.set('appRoot', appRoot);
  new Server(cfg).run();
};
