const { describe } = require('mocha');

const { testServer, equal, when } = require('./util');

module.exports = ({ server }) => {
  describe('Basic Authentication', () => {
    const auth = 'nails:is awesome';
    const token = Buffer.from(auth).toString('base64');
    describe('returns 401', () => {
      when('no authentication is provided', () => testServer(server, '/test/auth').then(res => {
        equal([
          [res.statusCode, 401],
          [res._getString(), 'Did you try nails:is awesome?'],
        ]);
      }));
      when('incorrect authentication is provided', () => testServer(server, '/test/auth', { headers: {
        Authorization: 'Basic ' + Buffer.from('user:pass').toString('base64'),
      } }).then(res => {
        equal([
          [res.statusCode, 401],
          [res._getString(), 'Nope!'],
        ]);
      }));
    });
    describe('returns 200', () => {
      when('the correct credentials are provided', () => testServer(server, '/test/auth', { headers: {
        Authorization: 'Basic ' + token,
      } }).then(res => {
        equal([
          [res.statusCode, 200],
          [res._getString(), 'You’re in: ' + token],
        ]);
      }));
    });
  });
};
