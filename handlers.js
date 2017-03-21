var fs = require("fs");
var url = require("url");
var utils = require("./utils.js");

var controllers = {};

exports.Handler = function () {
  var routes = {
    HEAD: {},
    GET: {},
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    OPTIONS: {}
  };

  if (fs.existsSync("app/routes.json")) {
    var rawRoutes = JSON.parse(fs.readFileSync("app/routes.json"));
    for (var i = 0; i < rawRoutes.length; i++) {
      if (utils.objValidate(rawRoutes[i], {required: ['type', 'url', 'to']})) {
        var action = rawRoutes[i].to;
        var actionSplat = action.split(".");
        var controller = actionSplat[0];
        var method = actionSplat[actionSplat.length - 1];
        var controllerFile = "./app/controllers/" + controller + ".js";

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
    if (routes[req.method].hasOwnProperty(uri.pathname)) {
      return routes[req.method][uri.pathname];
    }
    return null;
  };
};

exports.getStaticContent = name => {
  if (fs.existsSync("app/static/" + name)) {
    return fs.readFileSync("app/static/" + name);
  }
  return null;
};

exports.renderer = (req, res, opts) => {
  if (opts.text) {
    opts.content = opts.text;
    delete opts['text'];
    exports.renderer(req, res, Object.assign(opts, {headers: {'content-type': 'text/plain'}}));
    return;
  }
  else if (opts.json) {
    opts.content = JSON.stringify(opts.json);
    delete opts['json'];
    exports.renderer(req, res, Object.assign(opts, {headers: {'content-type': 'application/json'}}));
    return;
  }

  opts.headers = opts.headers || {'content-type': 'text/html'};
  var headerNames = Object.keys(opts.headers);
  for (var i = 0; i < headerNames.length; i++) {
    res.setHeader(headerNames[i], opts.headers[headerNames[i]]);
  }

  opts.status = opts.status || 200;
  res.statusCode = opts.status;

  if (opts.content) {
    res.write(opts.content);
    res.end();
  }
  else {
    res.statusCode = 204;
    res.end();
  }
};
