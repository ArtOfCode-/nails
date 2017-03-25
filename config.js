const json = Symbol('json');

exports = module.exports = class Config {
  constructor(file) {
    try {
      this[json] = require(file);
    }
    catch (err) {
      throw new ReferenceError("File doesn't exist: can't load config");
    }
  }
  has(key) {
    return this[json].hasOwnProperty(key);
  }

  get(key) {
    return this[json][key] || null;
  }

  set(key, value) {
    this[json][key] = value;
  }
};
