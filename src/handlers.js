const url = require("url");
const path = require("path");
const fs = require("mz/fs");

const ejs = require("ejs");
const createDebug = require('debug');
const schema = require('validate');

const Route = require('./route');

const debug = createDebug('nails:handlers');
const warn = createDebug('nails:WARNING');

const controllers = {};

function setView({ action, config, rawRoute, routes, method }) {
  return exports.getView(action, config).then(view => {
    routes[rawRoute.type].push({
      method,
      view,
      match: new Route(rawRoute.url)
    });
  });
}

const routeSchema = schema({
  type: {
    type: 'string',
    required: true,
    message: 'type is required and must be a valid HTTP verb',
    match: /GET|HEAD|POST|PUT|DELETE|TRACE|OPTIONS|CONNECT|PATCH/i,
  },
  url: {
    type: 'string',
    required: true,
    message: 'url is required',
  },
  to: {
    type: 'string',
    required: true,
    message: 'to is required',
  },
});

exports = module.exports = class Handler {
  constructor(config) {
    const routes = {
      HEAD: [],
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
      OPTIONS: []
    };

    const routesPath = config.appRoot + '/routes';
    debug('loading routes at', routesPath);
    let rawRoutes;
    try {
      rawRoutes = require(routesPath);
    }
    catch (err) {
      /* istanbul ignore next: kinda hard to test */
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
    }

    const promises = [];

    if (rawRoutes) {
      for (let i = 0; i < rawRoutes.length; i++) {
        const errors = routeSchema.validate(rawRoutes[i]);
        if (errors.length > 0) {
          /* istanbul ignore next: router.js always returns valid JSON */
          warn("found route %o: %s", rawRoutes[i], errors.map(error => error.message).join(', '));
        }
        else {
          const action = rawRoutes[i].to;
          const actionSplat = action.split(".");
          if (actionSplat.length === 1) {
            actionSplat.push(undefined);
          }
          const controller = actionSplat.slice(0, -1).join('/');
          const method = actionSplat[actionSplat.length - 1];
          const controllerFile = config.appRoot + '/controllers/' + controller;

          if (controllers[controller]) {
            promises.push(setView({
              action,
              config,
              rawRoute: rawRoutes[i],
              routes,
              method: method ? controllers[controller][method] : controllers[controller]
            }));
          }
          let loaded;
          try {
            loaded = require(controllerFile);
          }
          catch (err) {
            /* istanbul ignore next: kinda hard to test */
            if (err.code === 'MODULE_NOT_FOUND') {
              debug('failed to load controller at', controllerFile);
            } else {
              throw err;
            }
          }
          if (loaded) {
            controllers[controller] = loaded;
            promises.push(setView({
              action,
              config,
              rawRoute: rawRoutes[i],
              routes,
              method: method ? controllers[controller][method] : controllers[controller]
            }));
          }
          else {
            warn("Route", rawRoutes[i], "controller doesn't exist - ignoring.");
          }
        }
      }
      this.routes = routes;
    }
    else {
      /* istanbul ignore next: kinda hard to test */
      throw new ReferenceError("Tried to load the routing file, but it doesn't exist!");
    }
    this.ready = Promise.all(promises);
    this.ready.then(() => {
      debug('loaded', rawRoutes.length, 'routes');
    }).catch(warn);
  }

  getHandler(req) {
    const uri = url.parse(req.url, true);
    const route = this.routes[req.method].find(({ match }) => match.match(uri.pathname));
    return route ? { route, params: route.match.match(uri.pathname) } : null;
  }
};

exports.getStaticContent = (name, config) => {
  const staticPath = path.join(config.appRoot, "static", name);
  return fs.exists(staticPath).then(exists => exists ? fs.readFile(staticPath, 'utf-8') : null).catch(/* istanbul ignore next */ () => null);
};

exports.getView = (route, config) => {
  const action = route.split(".");
  const controller = action[0];
  const method = action[action.length - 1];
  const viewPath = path.join(config.appRoot, "views", controller, method + ".ejs");
  return fs.exists(viewPath).then(exists => {
    if (exists) {
      return fs.readFile(viewPath, 'utf-8').then(contents => ejs.compile(contents, {
        filename: viewPath
      }));
    }
  }).catch(warn);
};

exports.renderer = (req, res, opts) => {
  opts.headers = opts.headers || { 'content-type': 'text/html' };
  const headerNames = Object.keys(opts.headers);
  for (let i = 0; i < headerNames.length; i++) {
    res.setHeader(headerNames[i], opts.headers[headerNames[i]]);
  }

  if (opts.text) {
    opts.content = opts.text;
    delete opts.text;
    exports.renderer(req, res, Object.assign(opts, { headers: { 'content-type': 'text/plain' } }));
    return;
  }
  else if (opts.json) {
    opts.content = JSON.stringify(opts.json);
    delete opts.json;
    exports.renderer(req, res, Object.assign(opts, { headers: { 'content-type': 'application/json' } }));
    return;
  }

  opts.status = opts.status || 200;
  res.statusCode = opts.status;

  if (opts.view) {
    const view = opts.route.view;
    if (view) {
      opts.locals = opts.locals || {};
      res.write(view(opts.locals));
      res.end();
    }
    else {
      warn("handlers.renderer: render specified view: true, but no view present.");
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
