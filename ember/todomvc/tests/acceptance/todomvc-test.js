/* global visit */
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import startApp from "todomvc/tests/helpers/start-app";
import destroyApp from "todomvc/tests/helpers/destroy-app";
import { percySnapshot } from "ember-percy";
import TodoMVC from "todomvc/tests/interactors/app";

describe("Acceptance | todomvc", function() {
  let application;
  let TodoApp = new TodoMVC();

  beforeEach(function() {
    application = startApp();
    window.localStorage.clear();
  });

  afterEach(function() {
    destroyApp(application);
  });

  beforeEach(async () => {
    await visit("/");
  });

  describe("When page is initially opened", () => {
    it("should focus on the todo input field", async () => {
      await TodoApp.when(() => expect(TodoApp.newInputIsFocused).to.equal(true));
    });
  });

  describe("No Todos", () => {
    it("should hide #main and #footer", async function() {
      await TodoApp.when(() => {
        expect(TodoApp.todoList().length).to.equal(0);
        expect(TodoApp.footerExists).to.equal(false);
      }).do(() => percySnapshot(this.test));
    });
  });

  describe("New Todo", function() {
    it("should allow me to add todo items", async function() {
      // create 1st todo
      await TodoApp
        .newTodo("My First Todo")
        .submitTodo()
        // make sure the 1st label contains the 1st todo text
        .when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"))
        // create 2nd todo
        .newTodo("My Second Todo")
        .submitTodo()
        // make sure the 2nd label contains the 2nd todo text
        .when(() => expect(TodoApp.todoList(1).todoText).to.equal("My Second Todo"))
        .do(() => percySnapshot(this.test));
    });

    it("should clear text input field when an item is added", async () => {
      await TodoApp
        .newTodo("My First Todo")
        .submitTodo()
        .when(() => expect(TodoApp.newTodoInputValue).to.equal(""));
    });

    it("should append new items to the bottom of the list", async function() {
      await TodoApp
        .newTodo("My First Todo")
        .submitTodo()
        .when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"))
        .newTodo("My Second Todo")
        .submitTodo()
        .when(() => expect(TodoApp.todoList(1).todoText).to.equal("My Second Todo"))
        .newTodo("My Third Todo")
        .submitTodo()
        .when(() => expect(TodoApp.todoList(2).todoText).to.equal("My Third Todo"))
        .when(() => expect(TodoApp.todoCountText).to.equal("3 items left"))
        .do(() => percySnapshot(this.test));
    });

    it("should trim text input", async function() {
      await TodoApp
        .newTodo("    My First Todo     ")
        .submitTodo()
        .when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"));
    });

    it("should show #main and #footer when items added", async function() {
      await TodoApp
        .newTodo("My First Todo")
        .submitTodo()
        .when(() => {
          expect(TodoApp.footerExists).to.equal(true);
          expect(TodoApp.todoList().length).to.equal(1);
          expect(TodoApp.todoCountText).to.equal("1 item left");
        })
        .do(() => percySnapshot(this.test));
    });
  });

  describe("Mark all as completed", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should allow me to mark all items as completed", async function() {
      await TodoApp
        .completeAllTodos()
        // get each todo li and ensure it is 'completed'
        .when(() => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(true);
          expect(TodoApp.todoList(1).isCompleted).to.equal(true);
        })
        .do(() => percySnapshot(this.test));
    });

    it("should allow me to clear the complete state of all items", async function() {
      // check and then immediately uncheck
      await TodoApp
        .completeAllTodos()
        .completeAllTodos()
        .when(() => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(false);
          expect(TodoApp.todoList(1).isCompleted).to.equal(false);
        })
        .do(() => percySnapshot(this.test));
    });

    it("complete all checkbox should update state when items are completed / cleared", async function() {
      await TodoApp
        .completeAllTodos()
        .when(() => expect(TodoApp.completeAllIsChecked).to.equal(true))
        .todoList(0).toggle()
        // make sure toggle all is not checked
        .when(() => expect(TodoApp.completeAllIsChecked).to.equal(false))
        // toggle the first todo
        .todoList(0).toggle()
        // assert the toggle all is checked again
        .when(() => expect(TodoApp.completeAllIsChecked).to.equal(true))
        .do(() => percySnapshot(this.test));
    });
  });

  describe("Item", function() {
    it("should allow me to mark items as complete", async function() {
      await TodoApp
        .createTwoTodos()
        .todoList(0).toggle()
        .when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(true))
        .when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(false))
        .todoList(1).toggle()
        .when(() => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(true);
          expect(TodoApp.todoList(1).isCompleted).to.equal(true);
        })
        .do(percySnapshot(this.test));
    });

    it("should allow me to un-mark items as complete", async function() {
      await TodoApp
        .createTwoTodos()
        .todoList(0).toggle()
        .when(() => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(true);
          expect(TodoApp.todoList(1).isCompleted).to.equal(false);
        })
        .todoList(0).toggle()
        .when(() => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(false);
          expect(TodoApp.todoList(1).isCompleted).to.equal(false);
        })
        .do(() => percySnapshot(this.test));
    });

    it("should allow me to edit an item", async function() {
      await TodoApp
        .createTwoTodos()
        .todoList(1)
        .only()
        .doubleClick()
        .fillInput("buy some sausages")
        .pressEnter();

      // explicitly assert about the text value
      await TodoApp
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My First Todo")
          expect(TodoApp.todoList(1).text).to.equal("buy some sausages")
        })
        .do(() => percySnapshot(this.test));
    });
  });

  describe("Editing", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should hide other controls when editing", async function() {
      await TodoApp
        .todoList(1).doubleClick()
        .when(() => {
          expect(TodoApp.todoList(1).labelIsVisible).to.equal(false);
          expect(TodoApp.todoList(1).toggleIsVisible).to.equal(false);
        })
        .do(() => percySnapshot(this.test));
    });

    it("should save edits on blur", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("buy some sausages")
        .blurInput()
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My First Todo");
          expect(TodoApp.todoList(1).text).to.equal("buy some sausages");
        });
    });

    it("should trim entered text", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("    buy some sausages    ")
        .pressEnter()
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My First Todo");
          expect(TodoApp.todoList(1).text).to.equal("buy some sausages");
        })
        .do(() => percySnapshot(this.test));
    });

    it("should remove the item if an empty text string was entered", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("")
        .pressEnter()
        .when(() => expect(TodoApp.todoList().length).to.equal(1));
    });

    it("should cancel edits on escape", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("")
        .pressEscape()
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My First Todo")
          expect(TodoApp.todoList(1).text).to.equal("My Second Todo")
        })
        .do(() => percySnapshot(this.test));
    });
  });

  describe("Counter", function() {
    it("should display the current number of todo items", async function() {
      await TodoApp
        .newTodo("My First Todo")
        .submitTodo()
        .when(() => expect(TodoApp.todoCountText).to.equal("1 item left"))
        .newTodo("My Second Todo")
        .submitTodo()
        .when(() => expect(TodoApp.todoCountText).to.equal("2 items left"))
        .do(() => percySnapshot(this.test));

    });
  });

  describe("Clear completed button", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should display the correct text", async function() {
      await TodoApp
        .todoList(0).toggle()
        .when(() => expect(TodoApp.clearCompletedText).to.equal("Clear completed"));
    });

    it("should remove completed items when clicked", async function() {
      await TodoApp
        .todoList(0).toggle()
        .clearCompleted()
        .when(() => {
          expect(TodoApp.todoList().length).to.equal(1);
          expect(TodoApp.todoList(0).text).to.equal("My Second Todo");
        })
        .do(() => percySnapshot(this.test));
    });

    it("should be hidden when there are no items that are completed", async function() {
      await TodoApp
        .todoList(0).toggle()
        .when(() => expect(TodoApp.clearCompletedText).to.equal("Clear completed"))
        .clearCompleted()
        .when(() => expect(TodoApp.clearCompletedPresent).to.equal(false))
        .do(() => percySnapshot(this.test));
    });
  });

  describe("Routing", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should allow me to display active items", async function() {
      await TodoApp
        .todoList(1).toggle()
        .clickActiveFilter()
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My First Todo")
          expect(TodoApp.todoList().length).to.equal(1)
        });
    });

    it("should allow me to display completed items", async function() {
      await TodoApp
        .todoList(1).toggle()
        .clickCompleteFilter()
        .when(() => {
          expect(TodoApp.todoList(0).text).to.equal("My Second Todo");
          expect(TodoApp.todoList().length).to.equal(1);
        });
    });

    it("should allow me to display all items", async function() {
      await TodoApp
        .todoList(1).toggle()
        .clickActiveFilter()
        .clickCompleteFilter()
        .clickAllFilter()
        .when(() => expect(TodoApp.todoList().length).to.equal(2))
        .do(() => percySnapshot(this.test));
    });

    it("should highlight the currently applied filter", async () => {
      await TodoApp.when(() => expect(TodoApp.allFilterHasSelectedClass).to.equal(true));
    });
  });
});
