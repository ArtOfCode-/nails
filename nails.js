var path = require("path");
var Server = require("./server");
var Config = require("./config");

exports.nails = (appRoot = path.dirname(require.main.filename)) => {
  var cfg = new Config(path.join(appRoot, "config"));
  cfg.set('appRoot', appRoot);
  new Server(cfg).run();
};
