var srv = require("./server.js");
var cfg = require("./config.js");

console.log(cfg, cfg.Config);

new srv.Server(new cfg.Config("app/config.json")).run();
