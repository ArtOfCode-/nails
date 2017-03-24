var path = require("path");
var Server = require("./server");
var Config = require("./config");

exports.nails = (appRoot = path.dirname(require.main.filename)) => {
  var cfg = new Config(appRoot + "/config.json");
  cfg.set('appRoot', appRoot);
  new Server(cfg).run();
};
