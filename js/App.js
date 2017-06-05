console.error = function(error) {
  debug_log('console error: ' + error);
}

var store = require('js/store.js').store;
debug_log('store initialized : ' + JSON.stringify(store.getState()));
store.subscribe(() => {
  debug_log('store changed : ' + JSON.stringify(store.getState()));
});
