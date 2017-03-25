let requestData = null;

exports.getRequestData = () => requestData;

exports.resetRequestData = () => {
  requestData = null;
};

exports.render = (opts, content) => {
  if (typeof opts !== "object") {
    content = opts;
    opts = {};
  }

  requestData = Object.assign(opts, {content});
};

exports.redirect = to => {
  requestData = requestData || {};
  requestData['redirect_to'] = to;
};
