var Observable = require('FuseJS/Observable');
var store = require('js/store.js').store;

var setVisibilityFilter = (filter) => {
  store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter
  });
}

var clearCompleted = () => {
  store.dispatch({
    type: 'CLEAR_COMPLETED'
  });
}

var remainingText = Observable('');
var canClearCompleted = Observable(false);

var render = () => {
  var state = store.getState();

  var todos = state.todos;
  var remainingTodos = todos.filter(t => t.state === 'ACTIVE');
  remainingText.value = '' + remainingTodos.length + ' remaining';

  canClearCompleted.value = todos.filter(t => t.state === 'COMPLETED').length > 0;
}

store.subscribe(render);
render();

module.exports = {
  showAll: () => setVisibilityFilter('SHOW_ALL'),
  showActive: () => setVisibilityFilter('SHOW_ACTIVE'),
  showCompleted: () => setVisibilityFilter('SHOW_COMPLETED'),
  remainingText: remainingText,
  clearCompleted: clearCompleted,
  canClearCompleted: canClearCompleted
};
