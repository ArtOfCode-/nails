var Server = require("./server.js").Server;
var Config = require("./config.js").Config;

exports.nails = appRoot => {
  var cfg = new Config(appRoot + "/config.json");
  cfg.set('appRoot', appRoot);
  new Server(cfg).run();
};
