const { describe, it: specify } = require('mocha');

const { testServer, assertContentType, equal } = require('./util');

const fourOhFour = require('./404');

module.exports = arg => {
  const { server } = arg;
  describe('renders', () => {
    specify('HTML', () => testServer(server, '/').then(res => {
      equal([
        [res._getString(), '<h1>Hi!!1</h1>'],
        [assertContentType(res), 'text/html'],
      ]);
    }));

    specify('plain text', () => testServer(server, '/status').then(res => {
      equal([
        [res._getString(), 'status ok'],
        [assertContentType(res), 'text/plain'],
      ]);
    }));

    specify('JSON', () => testServer(server, '/status/json').then(res => {
      equal([
        [res._getJSON(), { this: 'renders', as: 'json' }],
        [assertContentType(res), 'application/json'],
      ]);
    }));

    specify('a view', () => testServer(server, '/status/view').then(res => {
      equal([
        [res._getString(), '<h1>hi</h1>\n'],
        [assertContentType(res), 'text/html'],
      ]);
    }));

    fourOhFour(arg);
  });
};
