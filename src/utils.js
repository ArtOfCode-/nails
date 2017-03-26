const debug = require('debug')('nails:utils');

exports.objValidate = (obj, rules) => {
  if (!obj || !rules) {
    throw new ReferenceError("objValidate called without object or rules");
  }
  debug('validating %o with %o', obj, rules);

  if (rules.hasOwnProperty("required")) {
    const fieldsExisting = exports.aryCompact(rules.required.map(x => Boolean(obj[x])));
    if (fieldsExisting.length !== rules.required.length) {
      return false;
    }
  }

  if (rules.hasOwnProperty("forbidden")) {
    const fieldsAbsent = exports.aryCompact(rules.forbidden.map(x => !obj[x]));
    if (fieldsAbsent.length !== rules.forbidden.length) {
      return false;
    }
  }

  return true;
};

exports.aryCompact = (ary, custom) => {
  const ret = [];
  for (let i = 0; i < ary.length; i++) {
    if (typeof custom === "function") {
      if (custom(ary[i])) {
        ret.push(ary[i]);
      }
    }
    else if (ary[i]) {
      ret.push(ary[i]);
    }
  }

  return ret;
};
