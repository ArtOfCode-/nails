'use strict';

const path = require('path');
const fs = require('mz/fs');
const qs = require('qs');

const { describe, it } = require('mocha');

const { testServer, equal } = require('./util');

const twoOhFour = require('./204');
const render = require('./render');
const redirect = require('./redirect');
const caching = require('./caching');
const cookie = require('./cookie');
const auth = require('./auth');

module.exports = arg => {
  describe('server', () => {
    const { server } = arg;
    it('handles params correctly', () => testServer(server, '/test/1').then(res => {
      equal([
        [res.statusCode, 200],
        [res._getString(), '1'],
      ]);
    }));
    it('sets custom headers', () => testServer(server, '/status/json').then(res => {
      equal([
        [res._headers['x-status'], 'ok'],
      ]);
    }));
    it('loads static files', () => Promise.all([testServer(server, '/static/'), fs.readFile(path.join(server.config.appRoot, 'static', 'index.html'), 'utf8')]).then(([res, content]) => {
      equal([
        [res.statusCode, 200],
        [res._getString(), content],
      ]);
    }));
    const query = {
      a: 'b',
      c: ['d', 'e'],
    };
    it('handles querystrings correctly', () => testServer(server, '/test/query?' + qs.stringify(query)).then(res => {
      equal([
        [res.statusCode, 200],
        [res._getString(), JSON.stringify(query)],
      ]);
    }));

    render(arg);
    redirect(arg);
    twoOhFour(arg);
    cookie(arg);
    caching(arg);
  });
  auth(arg);
};
