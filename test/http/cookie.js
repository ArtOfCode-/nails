'use strict';

const { it } = require('mocha');

const { testServer, equal, match } = require('./util');

module.exports = ({ server }) => {
  it('handles cookies properly', () => testServer(server, '/test/cookie').then(res => {
    equal([
      [res.statusCode, 200],
      [res._headers['set-cookie'].length, 2],
    ]);
    equal([
      [match(/number=(?:\d|10); path=\//), res._headers['set-cookie'][0]],
      [match(/number\.sig=[a-zA-Z0-9-]{10,}; path=\//), res._headers['set-cookie'][1]],
    ]);
  }));
};
