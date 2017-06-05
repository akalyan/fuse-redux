var Observable = require('FuseJS/Observable');
var ObservablePlus = require('js/lib/ObservablePlus');
var store = require('js/store.js').store;

var deleteTodo = (arg) => {
  store.dispatch({ type: 'DELETE_TODO', id: arg.data.id });
}

var render = () => {
  debug_log('Rendering...');
  debug_log('  old: ' + todos$.toString());

  var state = store.getState();

  todos$.refreshAllMaintainOrder(
    state.todos,
    'id',
    (oldItem, newItem) => {
      debug_log('Comparing old ' + oldItem.id + ' and new ' + newItem.id);
      return oldItem.id == newItem.id;
    },
    (oldItem, newItem) => {
      oldItem.state.value = newItem.state;
      oldItem.completed.value = newItem.state === 'COMPLETED';
      oldItem.hidden.value = getHiddenState(newItem, state.visibilityFilter);
      debug_log('Updating old ' + oldItem.id + ' [' + oldItem.hidden.value + ']');
    },
    (newItem) => {
      var hiddenValue = getHiddenState(newItem, state.visibilityFilter);
      debug_log('Creating item ' + newItem.id + ' [' + hiddenValue + ']');
      return {
        id: newItem.id,
        text: newItem.text,
        state: Observable(newItem.state),
        completed: Observable((newItem.state === 'COMPLETED')),
        toggleTodo: () => store.dispatch({ type: 'TOGGLE_TODO', id: newItem.id }),
        deleteTodo: deleteTodo,
        hidden: Observable(hiddenValue)
      };
    }
  );
}

function getHiddenState(todo, visibilityFilter) {
  return (todo.state === 'DELETED') ? true :
    (todo.state === 'ACTIVE') ? (visibilityFilter === 'SHOW_COMPLETED') :
    (todo.state === 'COMPLETED') ? (visibilityFilter === 'SHOW_ACTIVE') :
    false;
}

var todos$ = ObservablePlus();
store.subscribe(render);
render();

module.exports = {
  todos: todos$
};
