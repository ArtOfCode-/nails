const assert = require('assert');
const path = require('path');
const fs = require('fs');

const MockReq = require('mock-req');
const MockRes = require('mock-res');

process.env.DEBUG = process.env.DEBUG || "-*";
const serverPath = path.join(__dirname, '..', 'nails-example', 'app');

const { describe, before, it } = require('mocha');
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
  it('renders a 404 page as HTML', () => testServer(server, '/').then(res => {
    assert.equal(res._getString(), fs.readFileSync(path.join(serverPath, 'static', '404.html'), 'utf8'));
    assertContentType(res, 'text/html');
  }));
});
