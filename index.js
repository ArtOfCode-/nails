var Server = require("./server.js").Server;
var Config = require("./config.js").Config;

new Server(new Config("app/config.json")).run();
