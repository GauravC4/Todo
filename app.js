//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-submit");
const todoList = document.querySelector(".todo-list");
const filter = document.querySelector(".filter-todos");

//event listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", checkDelete);
filter.addEventListener("click", filterTodo);
window.addEventListener("DOMContentLoaded", LocalStore.renderLocalTodos);

//functions
function addTodo($event) {
  $event.preventDefault();
  if (todoInput.value.length < 1) return;
  if (!LocalStore.exists(todoInput.value)) {
    LocalStore.persist(LocalStore.ADD, todoInput.value);
    addTodoToDom(todoInput.value);
  } else {
    setComplete(todoInput.value);
  }
  todoInput.value = "";
}

function addTodoToDom(value, checked = false) {
  const newTodo = document.createElement("li");

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (checked) todoDiv.classList.toggle("completed");

  const todoText = document.createElement("span");
  todoText.classList.add("todo-text");
  todoText.innerText = value;

  const todoAction = document.createElement("div");
  todoAction.classList.add("todo-action");

  const todoCheck = document.createElement("button");
  todoCheck.innerHTML = '<i class="fas fa-check"></i>';
  todoCheck.classList.add("todo-check");

  const todoDel = document.createElement("button");
  todoDel.innerHTML = '<i class="fas fa-trash"></i>';
  todoDel.classList.add("todo-del");

  todoAction.appendChild(todoCheck);
  todoAction.append(todoDel);

  todoDiv.appendChild(todoText);
  todoDiv.appendChild(todoAction);

  newTodo.appendChild(todoDiv);

  todoList.appendChild(newTodo);
}

function checkDelete($event) {
  const item = $event.target;
  if (item.classList[0] == "todo-del") {
    const target = item.closest("li");
    target.classList.add("fall");
    // del from local storage
    LocalStore.persist(
      LocalStore.REMOVE,
      item.closest(".todo").firstChild.innerText
    );
    //remove from dom after transition completes
    target.addEventListener("transitionend", () => {
      target.remove();
    });
  } else if (item.classList[0] == "todo-check") {
    item.closest(".todo").classList.toggle("completed");
    LocalStore.persist(
      LocalStore.COMPLETE,
      item.closest(".todo").firstChild.innerText
    );
  }
}

function filterTodo($event) {
  const filter = $event.target.value;
  todoList.childNodes.forEach(function (todo) {
    //toggle display based on filter selected
    if (filter == "all") {
      todo.firstChild.style.display = "flex";
    } else if (filter == "completed") {
      if (todo.firstChild.classList.contains("completed")) {
        todo.firstChild.style.display = "flex";
      } else {
        todo.firstChild.style.display = "none";
      }
    } else if (filter == "uncompleted") {
      if (!todo.firstChild.classList.contains("completed")) {
        todo.firstChild.style.display = "flex";
      } else {
        todo.firstChild.style.display = "none";
      }
    }
  });
}

function setComplete(value) {
  todoList.childNodes.forEach(function (todo) {
    todo = todo.firstChild;
    let todoVal = todo.firstChild.innerText;
    if (value == todoVal && todo.classList.contains("completed")) {
      todo.classList.remove("completed");
      LocalStore.persist(LocalStore.COMPLETE, value);
    }
  });
}
