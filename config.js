var fs = require("fs");

exports.Config = file => {
  var json;

  if (fs.existsSync(file) && !fs.lstatSync(file).isDirectory()) {
    json = JSON.parse(fs.readFileSync(file));
  }
  else {
    throw new ReferenceError("File doesn't exist: can't load config");
  }

  this.has = key => {
    return json.hasOwnProperty(key);
  };

  this.get = key => {
    return json[key] || null;
  };

  this.set = (key, value, write) => {
    json[key] = value;
    if (write) {
      fs.writeFileSync(file, JSON.stringify(json));
    }
  };
};
