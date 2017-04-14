const { describe } = require('mocha');

const { testServer, equal, when } = require('./util');

module.exports = ({ server }) => {
  describe('returns 204', () => {
    when('view:true is specified, but no view can be found', () => testServer(server, '/test/badView').then(res => {
      equal([
        [res.statusCode, 204],
        [res._getString(), ''],
      ]);
    }));

    when('no library methods are called', () => testServer(server, '/test/nada').then(res => {
      equal([
        [res.statusCode, 204],
        [res._getString(), ''],
      ]);
    }));
  });
};
