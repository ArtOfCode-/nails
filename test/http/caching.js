const { describe, it: test } = require('mocha');
const moment = require('moment');

const { testServer, equal } = require('./util');

module.exports = ({ server }) => {
  describe('sends cache headers to', () => {
    test('cache forever', () => testServer(server, '/test/cache/forever').then(res => {
      const expiresMoment = moment(res._headers.expires);
      equal([
        [res.statusCode, 200],
        [res._getString(), 'ok'],
        [Math.round(moment.duration(expiresMoment.diff(moment())).as('years')), 100],
        [res._headers['cache-control'], 'private'],
      ]);
    }));
    test('skip caching', () => testServer(server, '/test/cache/no-cache').then(res => {
      const expiresMoment = moment(res._headers.expires);
      equal([
        [res.statusCode, 200],
        [res._getString(), 'ok'],
        [Math.round(moment.duration(expiresMoment.diff(moment())).as('minutes')), 0],
        [res._headers['cache-control'], 'no-cache, no-store'],
      ]);
    }));
    test('cache for five minutes', () => testServer(server, '/test/cache/seconds/' + (60 * 5)).then(res => {
      const expiresMoment = moment(res._headers.expires);
      equal([
        [res.statusCode, 200],
        [res._getString(), 'ok'],
        [Math.round(moment.duration(expiresMoment.diff(moment())).as('minutes')), 5],
        [res._headers['cache-control'], 'private'],
      ]);
    }));
  });
};
