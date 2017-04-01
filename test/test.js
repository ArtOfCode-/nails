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

function assertContentType(res, type) {
  assert.equal(res.getHeader('content-type'), type);
}

describe('server', () => {
  let server;
  before(() => {
    server = nails(serverPath);
  });
  it('renders plain text', () => testServer(server, '/status').then(res => {
    assert.equal(res._getString(), 'status ok');
    assertContentType(res, 'text/plain');
  }));
  it('renders JSON', () => testServer(server, '/status/json').then(res => {
    assert.deepEqual(res._getJSON(), { this: 'renders', as: 'json' });
    assertContentType(res, 'application/json');
  }));
  it('renders a view', () => testServer(server, '/status/view').then(res => {
    assert.equal(res._getString(), '<h1>hi</h1>\n');
    assertContentType(res, 'text/html');
  }));
  it('redirects', () => testServer(server, '/status/redirect').then(res => {
    assert.equal(res.statusCode, 302);
    assert.equal(res.getHeader('location'), '/status');
    assert.equal(res._getString(), '');
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
