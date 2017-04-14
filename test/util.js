const assert = require('assert');
const { it } = require('mocha');

exports.equal = function equal(checks) {
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
};

exports.when = (test, ...args) => it('when ' + test, ...args);
exports.when.only = it.only;
exports.when.skip = it.skip;
