const crypto = require('crypto');

const auth = require('basic-auth');

/**
 * @class Auth
 * @classdesc HTTP auth checker and deserializer
 * @public
**/
/**
 * @member {string} name The username provided
 * @memberof Auth
 * @instance
**/
/**
 * @member {string} pass The password provided
 * @memberof Auth
 * @instance
**/
/**
 * @member {boolean} invalid Is the authentication possibly valid?
 * @memberof Auth
 * @instance
**/

/**
 * @private
 * @function createAuth
 * @param {Object} library The library instance being rendered
 * @param {Function} setHeader The function to call to set a header on the response
 * @returns {Object} The auth module of the context
**/
module.exports = ({ req, config }, setHeader) => Object.assign(auth(req) || { invalid: true }, {
  /**
   * Check the username and password in a semi-timing-safe manner
   * @memberof Auth
   * @instance
   * @param {string} user The username to check
   * @param {string} pass The password to check
   * @returns {boolean} Did the username and password sent match `user` and `pass`?
  **/
  check(user, pass) {
    if (this.invalid) {
      return false;
    }
    // TODO: Pad the strings to avoid being able to get the length.
    let userOK = user.length === this.name.length;
    userOK = userOK && crypto.timingSafeEqual(Buffer.from(user), Buffer.from(this.name));
    let passOK = pass.length === this.pass.length;
    passOK = passOK && crypto.timingSafeEqual(Buffer.from(pass), Buffer.from(this.pass));
    return userOK && passOK; // Avoid short-circuit-based timing attack
  },
  /**
   * @memberof Auth
   * @instance
   * @param {Object} options The options
   * @param {string} [options.realm=config.appName] The realm name to send to the user
  **/
  enable: ({ realm = config.appName }) => {
    setHeader('WWW-Authenticate', `Basic realm="${String(realm).replace('"', '\\"')}"`);
  },
});
