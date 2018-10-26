/* global visit */
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import startApp from "todomvc/tests/helpers/start-app";
import destroyApp from "todomvc/tests/helpers/destroy-app";
import { percySnapshot } from "ember-percy";
import TodoMVC from "todomvc/tests/interactors/app";
import { when } from "@bigtest/convergence";

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
      await when(() => expect(TodoApp.newInputIsFocused).to.equal(true));
    });
  });

  describe("No Todos", () => {
    it("should hide #main and #footer", async function() {
      await when(() => {
        expect(TodoApp.todoList().length).to.equal(0);
        expect(TodoApp.footerExists).to.equal(false);
      });

      await percySnapshot(this.test);
    });
  });

  describe("New Todo", function() {
    it("should allow me to add todo items", async function() {
      // create 1st todo
      await TodoApp.newTodo("My First Todo").submitTodo();

      // make sure the 1st label contains the 1st todo text
      await when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"));

      // create 2nd todo
      await TodoApp.newTodo("My Second Todo").submitTodo();

      // make sure the 2nd label contains the 2nd todo text
      await when(() => expect(TodoApp.todoList(1).todoText).to.equal("My Second Todo"));
      await percySnapshot(this.test);
    });

    it("should clear text input field when an item is added", async () => {
      await TodoApp.newTodo("My First Todo").submitTodo();
      await when(() => expect(TodoApp.newTodoInputValue).to.equal(""));
    });

    it("should append new items to the bottom of the list", async function() {
      await TodoApp.newTodo("My First Todo").submitTodo();
      await when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"));

      await TodoApp.newTodo("My Second Todo").submitTodo();
      await when(() => expect(TodoApp.todoList(1).todoText).to.equal("My Second Todo"));

      await TodoApp.newTodo("My Third Todo").submitTodo();
      await when(() => expect(TodoApp.todoList(2).todoText).to.equal("My Third Todo"));
      await when(() => expect(TodoApp.todoCountText).to.equal("3 items left"));
      await percySnapshot(this.test);
    });

    it("should trim text input", async function() {
      await TodoApp.newTodo("    My First Todo     ").submitTodo();
      await when(() => expect(TodoApp.todoList(0).todoText).to.equal("My First Todo"));
    });

    it("should show #main and #footer when items added", async function() {
      await TodoApp.newTodo("My First Todo").submitTodo();

      await when(() => {
        expect(TodoApp.footerExists).to.equal(true);
        expect(TodoApp.todoList().length).to.equal(1);
        expect(TodoApp.todoCountText).to.equal("1 item left");
      });
      await percySnapshot(this.test);
    });
  });

  describe("Mark all as completed", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should allow me to mark all items as completed", async function() {
      await TodoApp.completeAllTodos();

      // get each todo li and ensure it is 'completed'
      await when(() => {
        expect(TodoApp.todoList(0).isCompleted).to.equal(true);
        expect(TodoApp.todoList(1).isCompleted).to.equal(true);
      });
      await percySnapshot(this.test);
    });

    it("should allow me to clear the complete state of all items", async function() {
      // check and then immediately uncheck
      await TodoApp.completeAllTodos().completeAllTodos();

      await when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(false));
      await when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(false));
      await percySnapshot(this.test);
    });

    it("complete all checkbox should update state when items are completed / cleared", async function() {
      await TodoApp.completeAllTodos();
      await when(() => expect(TodoApp.completeAllIsChecked).to.equal(true));
      await TodoApp.todoList(0).toggle();

      // make sure toggle all is not checked
      await when(() => expect(TodoApp.completeAllIsChecked).to.equal(false));

      // toggle the first todo
      await TodoApp.todoList(0).toggle();

      // assert the toggle all is checked again
      await when(() => expect(TodoApp.completeAllIsChecked).to.equal(true));
      await percySnapshot(this.test);
    });
  });

  describe("Item", function() {
    it("should allow me to mark items as complete", async function() {
      await TodoApp.createTwoTodos();

      await TodoApp.todoList(0).toggle();
      await when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(true));

      await when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(false));
      await TodoApp.todoList(1).toggle();

      await when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(true));
      await when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(true));
      await percySnapshot(this.test);
    });

    it("should allow me to un-mark items as complete", async function() {
      await TodoApp.createTwoTodos();

      await TodoApp.todoList(0).toggle();
      await when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(true));
      await when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(false));

      await TodoApp.todoList(0).toggle();
      await when(() => expect(TodoApp.todoList(0).isCompleted).to.equal(false));
      await when(() => expect(TodoApp.todoList(1).isCompleted).to.equal(false));
      await percySnapshot(this.test);
    });

    it("should allow me to edit an item", async function() {
      await TodoApp.createTwoTodos();

      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("buy some sausages")
        .pressEnter();

      // explicitly assert about the text value
      await when(() => expect(TodoApp.todoList(0).text).to.equal("My First Todo"));
      await when(() => expect(TodoApp.todoList(1).text).to.equal("buy some sausages"));
      await percySnapshot(this.test);
    });
  });

  describe("Editing", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should hide other controls when editing", async function() {
      await TodoApp.todoList(1).doubleClick();

      await when(() => {
        expect(TodoApp.todoList(1).labelIsVisible).to.equal(false);
        expect(TodoApp.todoList(1).toggleIsVisible).to.equal(false);
      });
      await percySnapshot(this.test);
    });

    it("should save edits on blur", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("buy some sausages")
        .blurInput();

      await when(() => expect(TodoApp.todoList(0).text).to.equal("My First Todo"));
      await when(() => expect(TodoApp.todoList(1).text).to.equal("buy some sausages"));
    });

    it("should trim entered text", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("    buy some sausages    ")
        .pressEnter();

      await when(() => expect(TodoApp.todoList(0).text).to.equal("My First Todo"));
      await when(() => expect(TodoApp.todoList(1).text).to.equal("buy some sausages"));
      await percySnapshot(this.test);
    });

    it("should remove the item if an empty text string was entered", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("")
        .pressEnter();

      await when(() => expect(TodoApp.todoList().length).to.equal(1));
    });

    it("should cancel edits on escape", async function() {
      await TodoApp.todoList(1)
        .only()
        .doubleClick()
        .fillInput("")
        .pressEscape();

      await when(() => expect(TodoApp.todoList(0).text).to.equal("My First Todo"));
      await when(() => expect(TodoApp.todoList(1).text).to.equal("My Second Todo"));
      await percySnapshot(this.test);
    });
  });

  describe("Counter", function() {
    it("should display the current number of todo items", async function() {
      await TodoApp.newTodo("My First Todo").submitTodo();
      await when(() => expect(TodoApp.todoCountText).to.equal("1 item left"));

      await TodoApp.newTodo("My Second Todo").submitTodo();
      await when(() => expect(TodoApp.todoCountText).to.equal("2 items left"));
      await percySnapshot(this.test);
    });
  });

  describe("Clear completed button", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should display the correct text", async function() {
      await TodoApp.todoList(0).toggle();
      await when(() => expect(TodoApp.clearCompletedText).to.equal("Clear completed"));
    });

    it("should remove completed items when clicked", async function() {
      await TodoApp.todoList(0)
        .toggle()
        .clearCompleted();

      await when(() => expect(TodoApp.todoList().length).to.equal(1));
      await when(() => expect(TodoApp.todoList(0).text).to.equal("My Second Todo"));
      await percySnapshot(this.test);
    });

    it("should be hidden when there are no items that are completed", async function() {
      await TodoApp.todoList(0).toggle();
      await when(() => expect(TodoApp.clearCompletedText).to.equal("Clear completed"));
      await TodoApp.clearCompleted();
      await when(() => expect(TodoApp.clearCompletedPresent).to.equal(false));
      await percySnapshot(this.test);
    });
  });

  describe("Routing", function() {
    beforeEach(async function() {
      await TodoApp.createTwoTodos();
    });

    it("should allow me to display active items", async function() {
      await TodoApp.todoList(1)
        .toggle()
        .clickActiveFilter();
      await when(() => expect(TodoApp.todoList(0).text).to.equal("My First Todo"));
      await when(() => expect(TodoApp.todoList().length).to.equal(1));
    });

    it("should allow me to display completed items", async function() {
      await TodoApp.todoList(1)
        .toggle()
        .clickCompleteFilter();

      await when(() => expect(TodoApp.todoList(0).text).to.equal("My Second Todo"));
      await when(() => expect(TodoApp.todoList().length).to.equal(1));
    });

    it("should allow me to display all items", async function() {
      await TodoApp.todoList(1)
        .toggle()
        .clickActiveFilter()
        .clickCompleteFilter()
        .clickAllFilter();

      await when(() => expect(TodoApp.todoList().length).to.equal(2));
      await percySnapshot(this.test);
    });

    it(
      "should highlight the currently applied filter",
      when(() => {
        expect(TodoApp.allFilterHasSelectedClass).to.equal(true);
      })
    );
  });
});
