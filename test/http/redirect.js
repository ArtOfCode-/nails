'use strict';

const { describe, it: test } = require('mocha');
const { testServer, custom, equal } = require('./util');

const to = custom('to');
const as = custom('as');

module.exports = ({ server }) => {
  describe('redirects', () => {
    to('a specific page', () => testServer(server, '/status/redirect').then(res => {
      equal([
        [res.statusCode, 302],
        [res.getHeader('location'), '/status'],
        [res._getString(), ''],
      ]);
    }));
    describe('to the previous page', () => {
      const sendRequest = (key, destination = '/some-random-page') => testServer(server, '/test/go-away', {
        headers: {
          [key]: '/some-random-page',
        },
      }).then(res => {
        equal([
          [res.statusCode, 302],
          [res.getHeader('location'), destination],
          [res._getString(), ''],
        ]);
      });

      describe('go to the previous page if the Referer header is sent', () => {
        const name = 'Referer';
        as('all lowercase', () => sendRequest(name.toLowerCase()));
        as('all uppercase', () => sendRequest(name.toUpperCase()));
        as('title case', () => sendRequest(name));
        as('alternating cases', () => sendRequest('ReFeReR'));
      });
      describe('go to the fallback page if', () => {
        test('no Referer is specified', () => testServer(server, '/test/go-away').then(res => {
          equal([
            [res.statusCode, 302],
            [res.getHeader('location'), '/'],
            [res._getString(), ''],
          ]);
        }));
        test('the header is spelled Referrer', () => sendRequest('Referrer', '/'));
      });
    });
  });
};
