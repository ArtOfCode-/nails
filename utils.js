exports.objValidate = (obj, rules) => {
  if (!obj || !rules) {
    throw new ReferenceError("objValidate called without object or rules");
  }

  if (rules.hasOwnProperty("required")) {
    var fieldsExisting = exports.aryCompact(rules.required.map(x => Boolean(obj[x])));
    if (fieldsExisting.length !== rules.required.length) {
      return false;
    }
  }

  if (rules.hasOwnProperty("forbidden")) {
    var fieldsAbsent = exports.aryCompact(rules.forbidden.map(x => !obj[x]));
    if (fieldsAbsent.length !== rules.forbidden.length) {
      return false;
    }
  }

  return true;
};

exports.aryCompact = (ary, custom) => {
  var ret = [];
  for (var i = 0; i < ary.length; i++) {
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
