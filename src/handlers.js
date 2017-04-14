const url = require("url");
const path = require("path");
const fs = require("mz/fs");

const ejs = require("ejs");
const schema = require('validate');

const Route = require('./route');
const { createDebug, warn } = require('./util');

const debug = createDebug('handlers');

const cache = {
  channels: {},
  controllers: {},
};

function setView({ action, config, route, routes, method }) {
  const ws = route.ws;
  return exports.getView(action, config).then(view => {
    routes[ws ? 'ws' : route.type].push({
      action,
      method,
      view,
      match: new Route(route.url)
    });
  });
}

const routeSchema = schema({
  ws: {
    type: 'boolean',
    required: false
  },
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

const wsSchema = schema({
  ws: true,
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
    this.routes = {
      ws: [],
      HEAD: [],
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
      OPTIONS: []
    };

    this.config = config;

    const routesPath = this.config.appRoot + '/routes';
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

    let promises = [];

    if (rawRoutes) {
      for (let i = 0; i < rawRoutes.length; i++) {
        const rawRoute = rawRoutes[i];
        let errors = routeSchema.validate(rawRoute);
        if (errors.length > 0) {
          if (rawRoute.ws) {
            errors = wsSchema.validate(rawRoute);
          }
          /* istanbul ignore next: router.js always returns valid JSON */
          if (errors.length > 0) {
            warn("found route %o: %s", rawRoute, errors.map(error => error.message).join(', '));
            continue;
          }
        }
        const { ws } = rawRoute;
        promises = promises.concat(this._parseRoute(rawRoute, ws ? 'channels' : 'controllers'));
      }
    } else {
      /* istanbul ignore next: kinda hard to test */
      throw new ReferenceError("Tried to load the routing file, but it doesn't exist!");
    }
    this.ready = Promise.all(promises);
    this.ready.then(() => {
      debug('loaded', rawRoutes.length, 'routes');
    }).catch(warn);
  }
  _parseRoute(route, key) {
    const promises = [];
    const action = route.to;
    const actionSplat = action.split(".");
    if (actionSplat.length === 1) {
      actionSplat.push(undefined);
    }
    const name = actionSplat.slice(0, -1).join('/');
    const method = actionSplat[actionSplat.length - 1];
    const path = `${this.config.appRoot}/${key}/${name}`;

    if (cache[key][name]) {
      promises.push(setView({
        action,
        config: this.config,
        route,
        routes: this.routes,
        method: method ? cache[key][name][method] : cache[key][name]
      }));
    }
    let loaded;
    try {
      loaded = require(path);
    }
    catch (err) {
      /* istanbul ignore next: kinda hard to test */
      if (err.code === 'MODULE_NOT_FOUND') {
        debug('failed to load controller at', path);
      } else {
        throw err;
      }
    }
    if (!loaded) {
      warn("Route", route, `${key.slice(0, -1)} doesn't exist - ignoring.`);
      return;
    }
    cache[key][name] = loaded;
    promises.push(setView({
      action,
      config: this.config,
      route,
      routes: this.routes,
      method: method ? cache[key][name][method] : cache[key][name]
    }));
    return promises;
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
  const viewPath = path.join(config.appRoot, 'views', controller, method + ".ejs");
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
