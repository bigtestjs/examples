import {
  is,
  text,
  interactor,
  clickable,
  fillable,
  triggerable,
  collection,
  isPresent,
  property,
  hasClass
} from "@bigtest/interactor";
import TodoItem from "./todo-item";

@interactor
class TodoMVC {
  titleText = text("h1");
  newTodo = fillable(".new-todo");
  newInputIsFocused = is(".new-todo", ":focus");
  isLoading = isPresent(".loading");
  footerExists = isPresent(".footer");
  todoCountText = text(".todo-count");
  activeFilter = text(".filters .selected");
  completeAllTodos = clickable(".toggle-all");
  completeAllIsChecked = property(".toggle-all", "checked");
  todoList = collection(".todo-list li", TodoItem);
  newTodoInputValue = property(".new-todo", "value");
  clearCompleted = clickable(".clear-completed");
  clearCompletedText = text(".clear-completed");
  clearCompletedPresent = isPresent(".clear-completed");
  clearCompletedExists = isPresent(".clear-completed");
  clickAllFilter = clickable(".filters li:first-child a");
  clickActiveFilter = clickable(".filters li:nth-child(2) a");
  clickCompleteFilter = clickable(".filters li:last-child a");
  allFilterHasSelectedClass = hasClass(".filters li:first-child a", "selected");
  completedFilterHasSelectedClass = hasClass(".filters li:last-child a", "selected");

  submitTodo = triggerable(".new-todo", "keydown", {
    keyCode: 13
  });

  createTwoTodos() {
    return this
      .newTodo("My First Todo")
      .submitTodo()
      .when(() => this.todoList(0).isPresent)
      .newTodo("My Second Todo")
      .submitTodo()
      .when(() => this.todoList(1).isPresent);
  }
}

export default TodoMVC;
