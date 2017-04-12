const { parse, tokensToRegExp, tokensToFunction } = require('path-to-regexp');
const chalk = require('chalk');

exports = module.exports = class Route {
  constructor(path, options = {}) {
    this.path = path;
    const tokens = parse(path);
    this.regex = tokensToRegExp(tokens, options);
    this.reverse = tokensToFunction(tokens);
  }
  /* istanbul ignore next */toString() {
    return `<route to ${chalk.bold.underline(this.path)}>`;
  }
  match(path) {
    const matches = this.regex.exec(path);
    if (!matches) {
      return false;
    }
    const result = {};
    matches.shift();
    this.regex.keys.forEach((key, i) => {
      let match = matches[i];
      // Stolen with ❤️ from express, https://github.com/expressjs/express/blob/9722202/lib/router/layer.js#L166-L181
      if (typeof match === 'string' && match.length > 0) {
        try {
          match = decodeURIComponent(match);
        } catch (err) {
          if (err instanceof URIError) {
            err.message = 'Failed to decode param \'' + match + '\'';
            err.status = err.statusCode = 400;
          }
          throw err;
        }
      }
      result[key.name] = match;
    });
    return result;
  }
};
