var path = require("path");
var Server = require("./server.js").Server;
var Config = require("./config.js").Config;

exports.nails = (appRoot = path.dirname(require.main.filename)) => {
  var cfg = new Config(appRoot + "/config.json");
  cfg.set('appRoot', appRoot);
  new Server(cfg).run();
};
