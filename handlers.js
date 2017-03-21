var fs = require("fs");
var url = require("url");
var utils = require("./utils.js");

var controllers = {};

exports.Handler = () => {
  var routes;

  if (fs.existsSync("app/routes.json")) {
    var rawRoutes = fs.readFileSync("app/routes.json");
    for (var i = 0; i < rawRoutes.length; i++) {
      if (utils.objValidate(rawRoutes[i], {required: ['type', 'url', 'to']})) {
        if (!routes[rawRoutes[i].type]) {
          routes[rawRoutes[i].type] = {};
        }

        var action = rawRoutes[i].to;
        var actionSplat = action.split(".");
        var controller = actionSplat[0];
        var method = actionSplat[actionSplat.length - 1];
        var controllerFile = "app/controllers/" + controller + ".js";

        if (controllers[controller]) {
          routes[rawRoutes[i].type][rawRoutes[i].url] = controllers[controller][method];
        }
        if (fs.existsSync(controllerFile)) {
          var loaded = require(controllerFile);
          controllers[controller] = loaded;
          routes[rawRoutes[i].type][rawRoutes[i].url] = controllers[controller][method];
        }
        else {
          console.log("WARNING: Route " + rawRoutes[i] + ": Controller doesn't exist - ignoring.");
        }
      }
      else {
        console.log("WARNING: Found route" + rawRoutes[i] + ": missing required key(s): type, url, to - ignoring.");
      }
    }
  }
  else {
    throw new ReferenceError("Tried to load the routing file, but it doesn't exist!");
  }

  this.getHandler = req => {
    var uri = url.parse(req.url, true);
    if (routes.hasOwnProperty(uri.pathname)) {
      return routes[uri.pathname];
    }
    return null;
  };
};
