'use strict';

const url = require('url');
const path = require('path');
const fs = require('mz/fs');

const schema = require('validate');

const Route = require('./route');
const loadView = require('./views');
const { createDebug, warn } = require('./util');

const debug = createDebug('handlers');

const cache = {
  channels: {},
  controllers: {},
};

/**
 * Set the view for a specific route
 * @private
 * @returns {Promise} Could the view be loaded?
**/
function setView({ action, config, route, routes, method }) {
  const ws = route.ws;
  return exports.getView(action, config).then(view => {
    routes[ws ? 'ws' : route.type].push({
      action,
      method,
      view,
      match: new Route(route.url),
    });
  });
}

/**
 * @typedef RouteJSON
**/
const routeSchema = schema({
  /**
   * @memberof RouteJSON
   * @member {?boolean} ws Is this route for a WebSocket connection
   * instead of an HTTP request?
  **/
  ws: {
    type: 'boolean',
    required: false,
  },
  /**
   * @memberof RouteJSON
   * @member {?string} type Which HTTP verb should this route respond to?
   *
   * This member is required unless `ws` is true.
  **/
  type: {
    type: 'string',
    required: true,
    message: 'type is required and must be a valid HTTP verb',
    match: /GET|HEAD|POST|PUT|DELETE|TRACE|OPTIONS|CONNECT|PATCH/i,
  },
  /**
   * @memberof RouteJSON
   * @member {string} url What path should the route respond to?
   *
   * This supports [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)-style
   * path matching.
  **/
  url: {
    type: 'string',
    required: true,
    message: 'url is required',
  },
  /**
   * @memberof RouteJSON
   * @member {string} to Which controller should be called?
  **/
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
  /**
   * @class Handler
   * @classdesc Routing handler
   * @description
   * You should not need to create instances of this class yourself.
   * Nails will automatically create one for you.
   * @param {Object} config The config object
  **/
  constructor(config) {
    /**
     * @member {Object} routes The route objects
     * @memberof Handler
     * @instance
    **/
    this.routes = {
      ws: [],
      HEAD: [],
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
      OPTIONS: [],
    };

    /**
     * @member {Object} config The config object
     * @memberof Handler
     * @instance
    **/
    this.config = config;

    const routesPath = this.config.appRoot + '/routes';
    debug('loading routes at', routesPath);
    let rawRoutes;
    try {
      rawRoutes = require(routesPath);
    } catch (err) {
      /* istanbul ignore next: kinda hard to test */
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
    }

    let promises = [];

    rawRoutes.forEach(rawRoute => {
      let errors = routeSchema.validate(rawRoute);
      if (errors.length > 0) {
        if (rawRoute.ws) {
          errors = wsSchema.validate(rawRoute);
        }
        /* istanbul ignore if: router.js always returns valid JSON */
        if (errors.length > 0) {
          warn('found route %o: %s', rawRoute, errors.map(err => err.message).join(', '));
          return;
        }
      }
      const { ws } = rawRoute;
      promises = promises.concat(this._parseRoute(rawRoute, ws ? 'channels' : 'controllers'));
    });
    /* istanbul ignore if: kinda hard to test */
    if (rawRoutes.length === 0) {
      throw new ReferenceError('Tried to load the routing file, but it doesn\'t exist!');
    }
    this.ready = Promise.all(promises);
    this.ready.then(() => {
      debug('loaded', rawRoutes.length, 'routes');
    }).catch(warn);
  }
  /**
   * @private
   * @param {RouteJSON} route The raw route
   * @param {string} key The key to look for in the cache (`"channels"` or `"controllers"`)
   * @returns {Promise[]} The array of promises to wait for until the view is loaded
  **/
  _parseRoute(route, key) {
    const promises = [];
    const action = route.to;
    const actionSplat = action.split('.');
    if (actionSplat.length === 1) {
      actionSplat.push('index');
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
        method: cache[key][name][method],
      }));
    }
    let loaded;
    try {
      loaded = require(path);
    } catch (err) {
      /* istanbul ignore else: kinda hard to test */
      if (err.code === 'MODULE_NOT_FOUND') {
        debug('failed to load controller at', path);
      } else {
        throw err;
      }
    }
    if (!loaded) {
      warn('Route', route, `${key.slice(0, -1)} doesn't exist - ignoring.`);
      return;
    }
    cache[key][name] = loaded;
    promises.push(setView({
      action,
      config: this.config,
      route,
      routes: this.routes,
      method: cache[key][name][method],
    }));
    return promises;
  }

  /**
   * @param {Request} req The HTTP request to get a handler for.
   * @returns {?Handler} The handler, or `null` if it could not be found
  **/
  getHandler(req) {
    const uri = url.parse(req.url, true);
    const route = this.routes[req.method].find(({ match }) => match.match(uri.pathname));
    return route ? { route, params: route.match.match(uri.pathname) } : null;
  }
};

/**
 * @memberof Handler
 * @param {string} name The file path to load
 * @param {Object} config The nails config
 * @returns {Promise.<?string>} The file content, or `null` if there was a problem
**/
exports.getStaticContent = (name, config) => {
  const staticPath = path.join(config.appRoot, 'static', name);
  return fs.exists(staticPath).then(exists => exists ? fs.readFile(staticPath, 'utf-8') : null).catch(/* istanbul ignore next */ () => null);
};

/**
 * @memberof Handler
 * @param {string} route The `to` value for the route
 * @param {Object} config The nails config
 * @returns {Promise.<?Function>} The template function, or `undefined`
 * if there was a problem
 * @see {@link http://devdocs.io/lodash~4/index#template _.template in the Lodash docs}
**/
exports.getView = (route, config) => {
  const action = route.split('.');
  const controller = action[0];
  const method = action[action.length - 1];
  const viewPath = path.join(config.appRoot, 'views', controller, method + '.ejs');
  return loadView(viewPath);
};

/**
 * @memberof Handler
 * @param {Request} req The HTTP request
 * @param {Response} res The HTTP response
 * @param {Object} opts The options
 * This renders the response to a request.
**/
exports.renderer = (req, res, opts) => {
  // TODO: Move this to `Context` or `library`
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
  } else if (opts.json) {
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
      res.write(view.call(opts.locals, opts.locals));
      res.end();
    } else {
      warn('handlers.renderer: render specified view: true, but no view present.', opts.route);
      res.statusCode = 204;
      res.end();
    }
  } else if (opts.content) {
    res.write(opts.content);
    res.end();
  } else {
    res.statusCode = 204;
    res.end();
  }
};
