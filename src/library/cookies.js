const Cookies = require('cookies');

const getCookie = (get, ...args) => {
  const str = get(...args);
  // istanbul ignore if: this is only for compatibility with the library itself
  if (args[0].endsWith('.sig')) {
    return str;
  }
  if (str == null || str === 'undefined') {
    return;
  }
  return JSON.parse(str);
};

module.exports = library => {
  const cookies = new Cookies(library.req, library.res, {
    keys: library.config.keys || [library.config.key],
  });
  const set = cookies.set.bind(cookies);
  const get = cookies.get.bind(cookies);
  cookies.set = (k, v, opts) => set(k, JSON.stringify(v), opts);
  cookies.get = getCookie.bind(null, get);
  cookies.delete = key => {
    set(key, null);
    set(key + '.sig', null);
  };
  return cookies;
};
