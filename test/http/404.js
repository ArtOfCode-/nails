const path = require('path');
const fs = require('mz/fs');
const { describe, after, it } = require('mocha');

const test = it;

const { testServer, assertContentType, equal } = require('./util');

module.exports = ({ server, serverPath }) => {
  describe('404 pages as', () => {
    const fourOhFourPath = path.join(serverPath, 'static', '404.html');

    test('HTML if 404.html is present', () => testServer(server, '/blah').then(res => {
      equal([
        [res._getString(), fs.readFileSync(fourOhFourPath, 'utf8')],
        [assertContentType(res), 'text/html'],
      ]);
    }));

    test('static text if 404.html is not present', () => fs.rename(fourOhFourPath, fourOhFourPath + '.bak').then(() => {
      return testServer(server, '/blah');
    }).then(res => {
      equal([
        [res._getString(), 'Not Found'],
        [assertContentType(res), 'text/plain'],
      ]);
    }));

    after(() => fs.rename(fourOhFourPath + '.bak', fourOhFourPath));
  });
};
