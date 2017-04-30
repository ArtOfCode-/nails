'use strict';

const assert = require('assert');
const { describe, it, it: test } = require('mocha');

const { toWordsOrdinal: ordinal } = require('number-to-words');
const debug = require('debug')('nails:test');
const _ = require('lodash');

const { equal } = require('./util');

exports = module.exports = ({ nails }) => {
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
  describe('lazy exports', () => {
    let router;
    let channel;
    let connection;
    it('works the first time', () => {
      router = nails.Router;
      channel = nails.Channel;
      connection = nails.Connection;
    });
    describe('returns the same object', () => {
      _.times(7, i => {
        i++; // `i` is 0-based
        test(`the ${ordinal(i + 1)} time`, () => {
          equal([
            [assert.equal, router, nails.Router],
            [assert.equal, channel, nails.Channel],
            [assert.equal, connection, nails.Connection],
          ]);
        });
      });
    });
  });
};
