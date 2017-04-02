const { describe, it } = require('mocha');

const { testServer, equal } = require('./util');

const twoOhFour = require('./204');
const render = require('./render');

module.exports = arg => {
  describe('server', () => {
    const { server } = arg;
    it('handles params correctly', () => testServer(server, '/test/1').then(res => {
      equal([
        [res.statusCode, 200],
        [res._getString(), '1'],
      ]);
    }));

    render(arg);
    twoOhFour(arg);
  });
};
