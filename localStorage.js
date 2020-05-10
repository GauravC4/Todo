var LocalStore = (function IFFE() {
  const ADD = "ADD";
  const REMOVE = "REMOVE";
  const COMPLETE = "COMPLETE";
  const PRIORITY = "PRIORITY";
  const LSkey = "Todos";

  function persist(action, value) {
    if (action == ADD) {
      _addToLocalTodos(value);
    } else if (action == REMOVE) {
      _removeFromLocalTodos(value);
    } else if (action == COMPLETE) {
      _toggleCompleteInLocalTodos(value);
    } else if (action == PRIORITY) {
      _prioritizeInLocalTodos(value[0], value[1]);
    }
  }

  function exists(todo) {
    let todos = _getLocalTodos();
    return _findTodo(todos, todo) > -1;
  }

  function _saveToLocalStorage(value) {
    localStorage.setItem(LSkey, JSON.stringify(value));
  }

  function _getLocalTodos() {
    if (localStorage.getItem(LSkey) != null) {
      return JSON.parse(localStorage.getItem(LSkey));
    }
    return [];
  }

  function _addToLocalTodos(todo) {
    let todos = _getLocalTodos();
    todos.push({ value: todo, complete: false });
    _saveToLocalStorage(todos);
  }

  function _removeFromLocalTodos(todo) {
    let todos = _getLocalTodos();
    todos.splice(_findTodo(todos, todo), 1);
    _saveToLocalStorage(todos);
  }

  function _toggleCompleteInLocalTodos(todo) {
    let todos = _getLocalTodos();
    let todoIdx = _findTodo(todos, todo);
    todos[todoIdx].complete = !todos[todoIdx].complete;
    _saveToLocalStorage(todos);
  }

  function _prioritizeInLocalTodos(curr, target) {
    if (!target) return;
    let todos = _getLocalTodos();
    currIdx = _findTodo(todos, curr);
    targetIdx = _findTodo(todos, target);
    let toInsert = todos.splice(currIdx, 1)[0];
    todos.splice(targetIdx, 0, toInsert);
    _saveToLocalStorage(todos);
  }

  function _findTodo(todos, todo) {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].value == todo) return i;
    }
    return -1;
  }

  function renderLocalTodos() {
    let todos = _getLocalTodos();
    todos.forEach((todo) => addTodoToDom(todo.value, todo.complete));
  }

  return {
    ADD: ADD,
    REMOVE: REMOVE,
    COMPLETE: COMPLETE,
    PRIORITY: PRIORITY,
    persist: persist,
    exists: exists,
    renderLocalTodos: renderLocalTodos,
  };
})();
