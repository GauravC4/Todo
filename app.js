//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-submit");
const todoList = document.querySelector(".todo-list");
const filter = document.querySelector(".filter-todos");

//event listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", impCheckDelete);
todoList.addEventListener("dblclick", increasePriority);
filter.addEventListener("click", filterTodo);
window.addEventListener("DOMContentLoaded", LocalStore.renderLocalTodos);

//globals
let clickRef = null;
let preventClick = false;

//functions
function addTodo($event) {
  $event.preventDefault();
  if (todoInput.value.length < 1) return;
  if (!LocalStore.exists(todoInput.value)) {
    LocalStore.persist(LocalStore.ADD, todoInput.value);
    addTodoToDom(todoInput.value);
  } else {
    // if item already exists , set incomplete if complete
    uncomplete(todoInput.value);
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

  const todoImp = document.createElement("button");
  todoImp.innerHTML = '<i class="fas fa-chevron-up"></i>';
  todoImp.classList.add("todo-imp");

  const todoCheck = document.createElement("button");
  todoCheck.innerHTML = '<i class="fas fa-check"></i>';
  todoCheck.classList.add("todo-check");

  const todoDel = document.createElement("button");
  todoDel.innerHTML = '<i class="fas fa-trash"></i>';
  todoDel.classList.add("todo-del");

  todoAction.appendChild(todoImp);
  todoAction.appendChild(todoCheck);
  todoAction.append(todoDel);

  todoDiv.appendChild(todoText);
  todoDiv.appendChild(todoAction);

  newTodo.appendChild(todoDiv);

  todoList.appendChild(newTodo);
}

function impCheckDelete($event) {
  const item = $event.target;
  if (item.classList[0] == "todo-imp") {
    increasePriority($event);
  } else if (item.classList[0] == "todo-del") {
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

function increasePriority($event) {
  if (preventClick) return;
  if ($event.type == "click") {
    // if already clicked within 300ms cancel prev click
    if (clickRef != null) clearTimeout(clickRef);
    clickRef = setTimeout(() => {
      //perform action if no repeated click within 300ms
      shiftUp($event, "single");
    }, 300);
  } else if ($event.type == "dblclick") {
    // if already clicked within 300ms cancel prev click
    if (clickRef != null) clearTimeout(clickRef);
    preventClick = true;
    shiftUp($event, "double");
    // allow click after 300ms
    setTimeout(() => {
      preventClick = false;
    }, 300);
  }
}

function shiftUp($event, click = "single") {
  let currNode = $event.target.closest("li");
  let parentNode = currNode.parentNode;

  if (click == "double") {
    var targetNode = currNode.parentNode.firstChild;
  } else {
    var targetNode = currNode.previousSibling;
  }

  // animation for shifting node up
  if (click == "double") {
    parentNode.classList.add("vanish");
  } else {
    if (targetNode) targetNode.firstChild.classList.add("vanish");
    currNode.firstChild.classList.add("vanish");
  }
  setTimeout(() => {
    // dom opertion happens on this line
    parentNode.insertBefore(currNode, targetNode);

    if (targetNode) targetNode.firstChild.classList.remove("vanish");
    currNode.firstChild.classList.remove("vanish");
    parentNode.classList.remove("vanish");
  }, 500);

  //save to local storage
  LocalStore.persist(LocalStore.PRIORITY, [
    currNode.firstChild.firstChild.innerText,
    targetNode != null
      ? targetNode.firstChild.firstChild.innerText
      : targetNode,
  ]);
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

// if a list item is complete , set as incomplete
function uncomplete(value) {
  todoList.childNodes.forEach(function (todo) {
    todo = todo.firstChild;
    let todoVal = todo.firstChild.innerText;
    if (value == todoVal && todo.classList.contains("completed")) {
      todo.classList.remove("completed");
      LocalStore.persist(LocalStore.COMPLETE, value);
    }
  });
}
