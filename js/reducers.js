var redux = require('js/lib/redux.js'); // combineReducers

var todos = (state = [], action) => {
  switch (action.type) {

    case 'ADD_TODO':
      var updated = state;
      updated.push({
        id: action.id,
        text: action.text,
        state: 'ACTIVE'
      });
      return updated;

    case 'TOGGLE_TODO':
      return state.map(todo => {
        var updated = todo;
        if (todo.id === action.id)
          updated.state = (updated.state === 'ACTIVE') ? 'COMPLETED' : 'ACTIVE';
        return updated;
      })

    case 'DELETE_TODO':
      return state.filter(todo => {
        return todo.id !== action.id;
      })

    case 'CLEAR_COMPLETED':
      return state.filter(todo => {
        return todo.state !== 'COMPLETED';
      })

    case 'TOGGLE_ALL':
      var active = state.filter(t => t.state === 'ACTIVE');
      if (active.length > 0) {
        return state.map(todo => {
          var updated = todo;
          if (todo.state === 'ACTIVE') updated.state = 'COMPLETED';
          return updated;
        })
      } else {
        return state.map(todo => {
          var updated = todo;
          if (todo.state === 'COMPLETED') updated.state = 'ACTIVE';
          return updated;
        })
      }

    default:
      return state
  }
}

var visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

var todoApp = redux.combineReducers({
  todos,
  visibilityFilter
});

module.exports = {
  todoApp
};
