(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const API_URL = "http://localhost:3000/todos";
  const $header = get(".header");
  const $todos = get(".todos");
  const $form = get(".todo-form");
  const $todoInput = get(".todo-input");

  const createTodoElement = (item) => {
    const { id, content, completed } = item;
    const $todoItem = document.createElement("div");
    const isChecked = completed ? "checked" : "";
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo-checkbox' 
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}"/>
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
    if ("" === $todoInput.value) {
      alert("할 일을 입력해주세요");
      return;
    }
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

  const toggleTodo = (e) => {
    //console.log(e.target.className);
    if ("todo-checkbox" !== e.target.className) {
      return;
    }

    const $item = e.target.closest(".item");
    // 특정 row를 식별하기 위해
    const id = $item.dataset.id;
    const completed = e.target.checked;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    }).catch((error) => console.log(error));
  };

  const changeEditMode = (e) => {
    const { className } = e.target;
    const $item = e.target.closest(".item");
    const $label = $item.querySelector("label");
    const $editInput = $item.querySelector("input[type='text']");
    const $contentButtons = $item.querySelector(".content-buttons");
    const $editButtons = $item.querySelector(".edit-buttons");
    const value = $editInput.value;

    if (className === "todo-edit-button") {
      $label.style.display = "none";
      $editInput.style.display = "block";
      $editInput.focus();
      $editInput.value = "";
      $editInput.value = value;
      // $editInput.setSelectionRange(
      //   $editInput.value.length,
      //   $editInput.value.length
      // );
      $contentButtons.style.display = "none";
      $editButtons.style.display = "block";
    } else if (className == "todo-edit-cancel-button") {
      $label.style.display = "block";
      $editInput.value = $label.innerText;
      $editInput.style.display = "none";
      $contentButtons.style.display = "block";
      $editButtons.style.display = "none";
    }
  };

  const editTodo = (e) => {
    const { className } = e.target;
    if (className !== "todo-edit-confirm-button") {
      return;
    }

    const $item = e.target.closest(".item");
    const id = $item.dataset.id;
    const $editInput = $item.querySelector("input[type='text']");
    const $label = $item.querySelector("label");
    const $contentButtons = $item.querySelector(".content-buttons");
    const $editButtons = $item.querySelector(".edit-buttons");
    const content = $editInput.value;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
      .then((res) => {
        if (res.ok) {
          $label.innerText = content;
          $editInput.style.display = "none";
          $label.style.display = "block";
          $contentButtons.style.display = "block";
          $editButtons.style.display = "none";
        }
      })
      .catch((error) => console.error(error));
  };

  const removeTodo = (e) => {
    const { className } = e.target;
    if ("todo-remove-button" !== className) {
      return;
    }

    const $item = e.target.closest(".item");
    const id = $item.dataset.id;

    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(getTodos)
      .catch((error) => console.error(error));
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", (e) => {
      getTodos();
    });

    $form.addEventListener("submit", addTodo);
    $todos.addEventListener("click", toggleTodo);
    $todos.addEventListener("click", changeEditMode);
    $todos.addEventListener("click", editTodo);
    $todos.addEventListener("click", removeTodo);
  };
  init();
})();
