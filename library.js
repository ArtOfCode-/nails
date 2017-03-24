var requestData = null;

exports.getRequestData = function () {
  return requestData;
};

exports.resetRequestData = function () {
  requestData = null;
};

exports.render = function (opts, content) {
  if (typeof opts !== "object") {
    content = opts;
    opts = {};
  }

  requestData = Object.assign(opts, {content});
};

exports.redirect = function (to) {
  requestData = requestData || {};
  requestData['redirect_to'] = to;
};
