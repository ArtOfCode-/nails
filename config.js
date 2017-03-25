exports = module.exports = function Config(file) {
  var json;

  try {
    json = require(file);
  }
  catch (err) {
    throw new ReferenceError("File doesn't exist: can't load config");
  }

  this.has = key => {
    return json.hasOwnProperty(key);
  };

  this.get = key => {
    return json[key] || null;
  };

  this.set = (key, value) => {
    json[key] = value;
  };
};
