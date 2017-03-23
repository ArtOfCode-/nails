var Server = require("./server.js").Server;
var Config = require("./config.js").Config;

exports.nails = appRoot => {
  new Server(new Config(appRoot + "/config.json").set('app_root', appRoot)).run();
};
