const assert = require('assert');

const MockReq = require('mock-req');
const MockRes = require('mock-res');

exports.testServer = function testServer(server, url, method = 'GET') {
  return server.handler.ready.then(() => new Promise(resolve => {
    const req = new MockReq({
      method,
      url,
      httpVersion: 'xx.TEST'
    });
    const res = new MockRes(() => {
      resolve(res);
    });
    req.connection = res.connection = {};
    server._handleRequest(req, res);
  }));
};

exports.assertContentType = function assertContentType(res, type) {
  if (!type) {
    return type => assertContentType(res, type);
  }
  assert.equal(res.getHeader('content-type'), type);
};

Object.assign(exports, require('../util'));
