const fs = require("fs");
const url = require("url");
const path = require("path");
const ejs = require("ejs");
const utils = require("./utils");

const controllers = {};

exports = module.exports = class Handler {
  constructor(config) {
    const routes = {
      HEAD: {},
      GET: {},
      POST: {},
      PUT: {},
      PATCH: {},
      DELETE: {},
      OPTIONS: {}
    };

    let rawRoutes;
    try {
      rawRoutes = require(config.get('appRoot') + '/routes');
    }
    catch (err) {}

    if (rawRoutes) {
      for (let i = 0; i < rawRoutes.length; i++) {
        if (utils.objValidate(rawRoutes[i], {required: ['type', 'url', 'to']})) {
          const action = rawRoutes[i].to;
          const actionSplat = action.split(".");
          const controller = actionSplat[0];
          const method = actionSplat[actionSplat.length - 1];
          const controllerFile = config.get('appRoot') + '/controllers/' + controller;

          if (controllers[controller]) {
            routes[rawRoutes[i].type][rawRoutes[i].url] = {
              method: controllers[controller][method],
              view: exports.getView(action, config)
            };
          }
          let loaded;
          try {
            loaded = require(controllerFile);
          }
          catch (err) {}
          if (loaded) {
            controllers[controller] = loaded;
            routes[rawRoutes[i].type][rawRoutes[i].url] = {
              method: controllers[controller][method],
              view: exports.getView(action, config)
            };
          }
          else {
            console.log("WARNING: Route " + rawRoutes[i] + ": Controller doesn't exist - ignoring.");
          }
        }
        else {
          console.log("WARNING: Found route" + rawRoutes[i] + ": missing required key(s): type, url, to - ignoring.");
        }
      }
      this.routes = routes;
    }
    else {
      throw new ReferenceError("Tried to load the routing file, but it doesn't exist!");
    }
  }

  getHandler(req) {
    const uri = url.parse(req.url, true);
    if (this.routes[req.method].hasOwnProperty(uri.pathname)) {
      return this.routes[req.method][uri.pathname].method;
    }
    return null;
  }
};

exports.getStaticContent = (name, config) => {
  const staticPath = path.join(config.get('appRoot'), "static", name);
  if (fs.existsSync(staticPath)) {
    return fs.readFileSync(staticPath);
  }
  return null;
};

exports.getView = (route, config) => {
  const action = route.split(".");
  const controller = action[0];
  const method = action[action.length - 1];
  const viewPath = path.join(config.get('appRoot'), "views", controller, method + ".ejs");
  if (fs.existsSync(viewPath)) {
    return ejs.compile(fs.readFileSync(viewPath).toString(), {
      filename: viewPath
    });
  }
  return null;
};

exports.renderer = (req, res, opts) => {
  if (!utils.objValidate(opts, {required: ['routes']})) {
    res.writeHead(500, 'Internal Server Error');
    res.end();
    console.error("ERROR: handlers.renderer: expected opts.routes, got " + opts['routes']);
    return;
  }

  opts.headers = opts.headers || {'content-type': 'text/html'};
  const headerNames = Object.keys(opts.headers);
  for (let i = 0; i < headerNames.length; i++) {
    res.setHeader(headerNames[i], opts.headers[headerNames[i]]);
  }

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

  opts.status = opts.status || 200;
  res.statusCode = opts.status;

  if (opts.view) {
    const view = opts.routes[req.method][url.parse(req.url, true).pathname].view;
    if (view) {
      opts.locals = opts.locals || {};
      res.write(view(opts.locals));
      res.end();
    }
    else {
      console.log("WARNING: handlers.renderer: render specified view: true, but no view present.");
      res.statusCode = 204;
      res.end();
    }
  }
  else if (opts.content) {
    res.write(opts.content);
    res.end();
  }
  else {
    res.statusCode = 204;
    res.end();
  }
};
