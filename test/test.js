const path = require('path');

process.env.DEBUG = process.env.DEBUG || "-*";
const { before, describe } = require('mocha');

const nails = global.NAILS_TEST_EXPORT = require('..');

const serverPath = path.join(__dirname, '..', 'nails-example', 'app');
const server = nails({ appRoot: serverPath, start: false });

before(() => server.handler.ready);

describe('HTTP', () => require('./http')({ server, serverPath }));
