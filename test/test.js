const assert = require('assert');
const path = require('path');
const fs = require('mz/fs');

const MockReq = require('mock-req');
const MockRes = require('mock-res');

process.env.DEBUG = process.env.DEBUG || "-*";
const serverPath = path.join(__dirname, '..', 'nails-example', 'app');

const { describe, before, it, after } = require('mocha');
const nails = global.NAILS_TEST_EXPORT = require('..');

function testServer(server, url, method = 'GET') {
  return new Promise(resolve => {
    const req = new MockReq({
      method,
      url,
      httpVersion: 'xx.TEST'
    });
    const res = new MockRes(() => {
      resolve(res);
    });
    server._handleRequest(req, res);
  });
}

function equal(checks) {
  checks.forEach(arg => {
    if (typeof arg[0] === 'function') {
      const [f, ...args] = arg;
      f(...args);
      // eslint-disable-next-line no-negated-condition
    } else if (typeof arg[1] !== 'string') {
      assert.deepEqual(...arg);
    } else {
      assert.equal(...arg);
    }
  });
}

function assertContentType(res, type) {
  if (!type) {
    return type => assertContentType(res, type);
  }
  assert.equal(res.getHeader('content-type'), type);
}

describe('server', () => {
  let server;
  before(() => {
    server = nails({ appRoot: serverPath, start: false });
  });

  it('renders HTML', () => testServer(server, '/').then(res => {
    equal([
      [res._getString(), '<h1>Hi!!1</h1>'],
      [assertContentType(res), 'text/html'],
    ]);
  }));

  it('renders plain text', () => testServer(server, '/status').then(res => {
    equal([
      [res._getString(), 'status ok'],
      [assertContentType(res), 'text/plain'],
    ]);
  }));

  it('renders JSON', () => testServer(server, '/status/json').then(res => {
    equal([
      [res._getJSON(), { this: 'renders', as: 'json' }],
      [assertContentType(res), 'application/json'],
    ]);
  }));

  it('renders a view', () => testServer(server, '/status/view').then(res => {
    equal([
      [res._getString(), '<h1>hi</h1>\n'],
      [assertContentType(res), 'text/html'],
    ]);
  }));

  it('redirects', () => testServer(server, '/status/redirect').then(res => {
    equal([
      [res.statusCode, 302],
      [res.getHeader('location'), '/status'],
      [res._getString(), ''],
    ]);
  }));

  it('returns 204 when view:true is specified, but no view can be found', () => testServer(server, '/test/badView').then(res => {
    equal([
      [res.statusCode, 204],
      [res._getString(), ''],
    ]);
  }));

  it('returns 204 when no library methods are called', () => testServer(server, '/test/nada').then(res => {
    equal([
      [res.statusCode, 204],
      [res._getString(), ''],
    ]);
  }));

  describe('renders 404 pages as', () => {
    const fourOhFourPath = path.join(serverPath, 'static', '404.html');

    it('HTML if 404.html is present', () => testServer(server, '/blah').then(res => {
      assert.equal(res._getString(), fs.readFileSync(fourOhFourPath, 'utf8'));
      assertContentType(res, 'text/html');
    }));

    it('static text if 404.html is not present', () => fs.rename(fourOhFourPath, fourOhFourPath + '.bak').then(() => {
      return testServer(server, '/blah');
    }).then(res => {
      assert.equal(res._getString(), 'Not Found');
      assertContentType(res, 'text/plain');
    }));

    after(() => fs.rename(fourOhFourPath + '.bak', fourOhFourPath));
  });
});
