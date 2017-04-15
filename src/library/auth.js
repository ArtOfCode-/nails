const crypto = require('crypto');

const auth = require('basic-auth');

module.exports = ({ req, config }, setHeader) => Object.assign(auth(req) || { invalid: true }, {
  check(user, pass) {
    if (this.invalid) {
      return false;
    }
    let userOK = user.length === this.name.length;
    userOK = userOK && crypto.timingSafeEqual(Buffer.from(user), Buffer.from(this.name));
    let passOK = pass.length === this.pass.length;
    passOK = passOK && crypto.timingSafeEqual(Buffer.from(pass), Buffer.from(this.pass));
    return userOK && passOK; // Avoid short-circuit-based timing attack
  },
  enable: ({ realm = config.appName }) => {
    setHeader('WWW-Authenticate', `Basic realm="${String(realm).replace('"', '\\"')}"`);
  },
});
