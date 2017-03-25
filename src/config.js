exports = module.exports = function createConfig(file) {
  let json;
  try {
    json = require(file);
  }
  catch (err) {
    console.log(err);
    throw new ReferenceError("File doesn't exist: can't load config");
  }
  return json;
  /* If special behavior is needed:
  return new Proxy(json, {
    get(target, property) {
      return target[property] || null;
    }
  });
  */
};
