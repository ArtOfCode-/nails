'use strict';

const path = require('path');

process.env.DEBUG = process.env.DEBUG || '-nails, nails:test,nails:test:*';
const { before, describe } = require('mocha');

const nails = global.NAILS_TEST_EXPORT = require('..');

const serverPath = path.join(__dirname, '..', 'nails-example', 'app');
const server = nails({ appRoot: serverPath, start: false });

// Needed to wait for server to load views etc.:
// eslint-disable-next-line mocha/no-top-level-hooks
before(() => server.handler.ready);

describe("require('node-nails')", () => require('./nails')({ nails }));
describe('HTTP', () => require('./http')({ server, serverPath }));
describe('WebSocket', () => require('./ws')({ server }));
