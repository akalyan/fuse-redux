var redux = require('js/lib/redux.js');
var reducers = require('js/reducers.js');

module.exports = {
  store: redux.createStore(reducers.todoApp)
}
