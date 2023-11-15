import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderPending, renderTodos } from "./use-cases";

const ElementIDs = {
  TodoList: ".todo-list",
  NewTodoInput: "#new-todo-input",
  ClearCompleted: ".clear-completed",
  TodoFilters: ".filtro",
  PendingCountLabel: "#pending-count",
};

export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(ElementIDs.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPending(ElementIDs.PendingCountLabel);
  }

  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //Referencias HTML

  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
  const todoListUL = document.querySelector(ElementIDs.TodoList);
  const clearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
  const filtersUL = document.querySelectorAll(ElementIDs.TodoFilters);
  
  //Listener

  newDescriptionInput.addEventListener("keyup", (e) => {
    if (e.keyCode !== 13) return;
    if (e.target.value.trim().length === 0) return;

    todoStore.addTodo(e.target.value.trim());
    displayTodos();
    e.target.value = "";
  });

  todoListUL.addEventListener("click", (e) => {
    const element = e.target.closest("[data-id]");
    todoStore.toggleTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  todoListUL.addEventListener("click", (e) => {
    const isDestroyElement = e.target.classList.contains("destroy");
    const element = e.target.closest("[data-id]");
    if (!element || !isDestroyElement) return;
    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  clearCompletedButton.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  filtersUL.forEach((element) => {
    element.addEventListener("click", (e) => {
      filtersUL.forEach((el) => el.classList.remove("selected"));
      e.target.classList.add("selected");
      switch (e.target.text) {
        case "All":
          todoStore.setFilter(Filters.All);
          break;
        case "Pending":
          todoStore.setFilter(Filters.Pending);
          break;
        case "Completed":
          todoStore.setFilter(Filters.Completed);
          break;
      }
      displayTodos();
    });
  });
};
