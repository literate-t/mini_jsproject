(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const API_URL = "http://localhost:3000/todos";
  const $todos = get(".todos");
  const $form = get(".todo-form");
  const $todoInput = get(".todo-input");

  const createTodoElement = (item) => {
    const { id, content } = item;
    const $todoItem = document.createElement("div");
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo-checkbox' 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item-buttons content-buttons">
              <button class="todo-edit-button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo-remove-button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item-buttons edit-buttons">
              <button class="todo-edit-confirm-button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo-edit-cancel-button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
    return $todoItem;
  };

  const renderAllTodos = (todos) => {
    $todos.innerHTML = ""; // init
    todos.forEach((item) => {
      const el = createTodoElement(item);
      $todos.appendChild(el);
    });
  };

  const getTodos = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((res) => renderAllTodos(res))
      .catch((error) => console.log(error));
  };

  const addTodo = (e) => {
    // form submit을 하면 기본 동작인 새로고침을 없앤다
    e.preventDefault();
    const todo = {
      content: $todoInput.value,
      completed: false,
    };
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((res) => {
        if (res.ok) {
          getTodos(); // 전체 다시 출력 말고 추가된 데이터만 그릴 수 없나..
        }
      })
      .then(() => {
        $todoInput.value = "";
        $todoInput.focus();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", (e) => {
      getTodos();
    });

    $form.addEventListener("submit", addTodo);
  };
  init();
})();
