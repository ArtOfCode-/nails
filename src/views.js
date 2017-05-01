const path = require('path');
const fs = require('mz/fs');

const template = require('lodash.template');

const { createDebug } = require('./util');

const debug = createDebug('views');

const cache = Object.create(null);

exports = module.exports = viewPath => {
  if (cache[viewPath]) {
    return Promise.resolve(cache[viewPath]);
  }
  return fs
    .readFile(viewPath, 'utf-8')
    .then(contents => exports.compile(contents, viewPath))
    .then(view => {
      cache[viewPath] = view;
      return view;
    }).catch(debug);
};

exports.sync = viewPath => {
  if (cache[viewPath]) {
    return cache[viewPath];
  }
  if (!fs.existsSync(viewPath)) {
    throw new Error(`Path ${viewPath} does not exist`);
  }
  cache[viewPath] = exports.compile(fs.readFileSync(viewPath, 'utf-8'), viewPath);
  return cache[viewPath];
};

exports.compile = (contents, viewPath) => template(contents, {
  variable: 'locals',
  imports: {
    include: includePath => exports.sync(path.resolve(viewPath, includePath)),
  },
  sourceURL: 'file://' + viewPath,
});
