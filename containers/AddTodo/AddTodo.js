var Observable = require('FuseJS/Observable');
var store = require('js/store.js').store;

var nextTodoId = 1;
var addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
});

var toggleAll = () => {
  store.dispatch({
    type: 'TOGGLE_ALL'
  });
}

var newTodoText = Observable('');
var addTodoClicked = function() {
  if (newTodoText.value) {
    store.dispatch(addTodo(newTodoText.value));
    newTodoText.value = '';
  }
}

module.exports = {
  newTodoText: newTodoText,
  addTodoClicked: addTodoClicked,
  toggleAll: toggleAll
};
