const path = require('path');
const assert = require('assert');

process.env.DEBUG = process.env.DEBUG || '-nails, nails:test,nails:test:*';
const debug = require('debug')('nails:test');
const { before, describe, it } = require('mocha');

const nails = global.NAILS_TEST_EXPORT = require('..');

const serverPath = path.join(__dirname, '..', 'nails-example', 'app');
const server = nails({ appRoot: serverPath, start: false });

before(() => server.handler.ready);

describe('HTTP', () => require('./http')({ server, serverPath }));
describe('WebSocket', () => require('./ws')({ server }));
describe('genKey', () => {
  let key;
  it('runs succesfully', () => {
    key = nails.genKey();
    debug('key:', key);
  });
  it('is 50 characters long', () => assert.equal(key.length, 50));
  it('only contains allowed characters', () => assert.ok(key.match(/^[a-z0-9!@#$%^&*(-_=+)]+$/)));
  it('allows specifying the length', () => assert.equal(nails.genKey(20).length, 20));
});
