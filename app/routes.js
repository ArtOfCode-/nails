const {Router} = require('..');

module.exports = Router.draw(({scope}) => {
  scope('status', ({get}) => {
    get('', 'status');
    get('param-switching', 'paramSwitching');
    get('json');
    get('view');
    get('redirect');
  });
});
