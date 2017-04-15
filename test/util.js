const assert = require('assert');
const { it } = require('mocha');

exports.equal = checks => {
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

exports.match = re => {
  return val => assert.ok(re.exec(val), `expected \`${val}\` to match ${re}`);
};

const custom = exports.custom = name => {
  const custom = (test, ...args) => it(name + ' ' + test, ...args);
  // eslint-disable-next-line mocha/no-exclusive-tests
  custom.only = (test, ...args) => it.only(name + ' ' + test, ...args);
  // eslint-disable-next-line mocha/no-skipped-tests
  custom.skip = (test, ...args) => it.skip(name + ' ' + test, ...args);
  return custom;
};

exports.when = custom('when');
