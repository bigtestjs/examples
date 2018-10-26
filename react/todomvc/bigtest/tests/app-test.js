import { expect } from "chai";
import { beforeEach, describe, it } from "@bigtest/mocha";
import { setupApplicationForTesting } from "../helpers/setup-app";
import { when } from "@bigtest/convergence";

import AppInteractor from "../interactors/app.js";

describe("TodoMVC BigTest example", () => {
  let TodoApp = new AppInteractor();

  beforeEach(async () => {
    await setupApplicationForTesting();
    await when(() => !TodoApp.isLoading);
  });

  describe("With no Todos", () => {
    it("hides the todolist", () => {
      expect(TodoApp.todoList().length).to.equal(0);
    });

    it("should focus on the todo input field", () => {
      expect(TodoApp.newInputIsFocused).to.equal(true);
    });

    it("hides the footer", () => {
      expect(TodoApp.footerExists).to.equal(false);
    });
  });

  describe("Creating a new Todo", () => {
    beforeEach(async () => {
      await TodoApp.newTodo("My First Todo").submitTodo();
    });

    it("should allow me to add todo items", () => {
      expect(TodoApp.todoList(0).todoText).to.equal("My First Todo");
    });

    it("clears the new todo input after submitting", () => {
      expect(TodoApp.newTodoInputValue).to.equal("");
    });

    it("shows the footer", () => {
      expect(TodoApp.footerExists).to.equal(true);
    });

    it("updates the footer count", () => {
      expect(TodoApp.todoCountText).to.equal("1 item");
    });

    it("does not display clear completed", () => {
      expect(TodoApp.clearCompletedExists).to.equal(false);
    });

    describe("editng the newly created todo", () => {
      beforeEach(async () => {
        await when(() => TodoApp.todoList(0).isPresent);
        await TodoApp.todoList(0)
          .only()
          .doubleClick()
          .fillInput("Edited");
      });

      it("hides controls while editing", () => {
        expect(TodoApp.todoList(0).toggleIsPresent).to.equal(false);
        expect(TodoApp.todoList(0).deleteIsPresent).to.equal(false);
      });

      describe("submiting the todo", () => {
        beforeEach(async () => {
          await TodoApp.todoList(0).pressEnter();
        });

        it("properly edits the todo", () => {
          expect(TodoApp.todoList(0).todoText).to.equal("Edited");
        });
      });

      describe("bluring the input while editing", () => {
        beforeEach(async () => {
          await TodoApp.todoList(0).blurInput();
        });

        it("properly edits the todo", () => {
          expect(TodoApp.todoList(0).todoText).to.equal("Edited");
        });
      });

      describe("pressing escape", () => {
        beforeEach(async () => {
          await TodoApp.todoList(0).pressEscape();
        });

        it("discards the edits", () => {
          expect(TodoApp.todoList(0).todoText).to.equal("My First Todo");
        });
      });
    });

    describe("Creating a second todo", () => {
      beforeEach(async () => {
        await when(() => TodoApp.todoList(0).isPresent);
        await TodoApp.newTodo("My Second Todo").submitTodo();
      });

      it("should allow me to add a second todo item", () => {
        expect(TodoApp.todoList(1).todoText).to.equal("My Second Todo");
      });

      it("updates the footer count", () => {
        expect(TodoApp.todoCountText).to.equal("2 items");
      });

      describe("clicking complete all", () => {
        beforeEach(async () => {
          await when(() => TodoApp.todoList(1).isPresent);
          await TodoApp.completeAllTodos();
        });

        it("completes all todos", () => {
          expect(TodoApp.todoList(0).isCompleted).to.equal(true);
          expect(TodoApp.todoList(1).isCompleted).to.equal(true);
        });

        it("has the correct text for clear all completed", () => {
          expect(TodoApp.clearCompletedText).to.equal("Clear completed");
        });

        it("updates the footer count", () => {
          expect(TodoApp.todoCountText).to.equal("No items");
        });

        describe("clicking clear completed", () => {
          beforeEach(async () => {
            await when(() => TodoApp.todoList(1).isCompleted);
            await TodoApp.clearCompleted();
          });

          it("Removes all completed todos", () => {
            expect(TodoApp.todoList().length).to.equal(0);
          });
        });

        describe("unchecking a single todo", () => {
          beforeEach(async () => {
            await when(() => TodoApp.todoList(1).isComplete);
            await TodoApp.todoList(1).toggle();
          });

          it("uncompletes the last todo", () => {
            expect(TodoApp.todoList(1).isCompleted).to.equal(false);
          });

          describe("clicking complete all again", () => {
            beforeEach(async () => {
              await when(() => TodoApp.todoList(1).isCompleted === false);
              await TodoApp.completeAllTodos();
            });

            it("completes all todos", () => {
              expect(TodoApp.todoList(0).isCompleted).to.equal(true);
              expect(TodoApp.todoList(1).isCompleted).to.equal(true);
            });
          });
        });

        describe("clicking complete all again", () => {
          beforeEach(async () => {
            await when(() => TodoApp.todoList(1).isComplete);
            await TodoApp.completeAllTodos();
          });

          it("uncompletes all todos", () => {
            expect(TodoApp.todoList(0).isCompleted).to.equal(false);
            expect(TodoApp.todoList(1).isCompleted).to.equal(false);
          });
        });
      });
    });
  });

  describe("creating a todo with lots of white space", () => {
    beforeEach(async () => {
      await TodoApp.newTodo("    My First Todo     ").submitTodo();
    });

    it("trims the created todo text", () => {
      expect(TodoApp.todoList(0).todoText).to.equal("My First Todo");
    });
  });

  describe("filtering todos", () => {
    beforeEach(async () => {
      await TodoApp.newTodo("Filter Todo").submitTodo();
      await when(() => TodoApp.todoList(0).isCompleted === false);
      await TodoApp.newTodo("Filter Todo 2")
        .submitTodo()
        .todoList(0)
        .toggle();
    });

    it("has the all filter selected by default", () => {
      expect(TodoApp.activeFilter).to.equal("All");
    });

    describe("clicking the active filter", () => {
      beforeEach(async () => {
        await TodoApp.clickActiveFilter();
      });

      it("displays one todo", () => {
        expect(TodoApp.todoList().length).to.equal(1);
        expect(TodoApp.todoList(0).todoText).to.equal("Filter Todo 2");
        expect(TodoApp.todoList(0).isCompleted).to.equal(false);
      });
    });

    describe("clicking the completed filter", () => {
      beforeEach(async () => {
        await TodoApp.clickCompleteFilter();
      });

      it("displays one todo", () => {
        expect(TodoApp.todoList().length).to.equal(1);
        expect(TodoApp.todoList(0).todoText).to.equal("Filter Todo");
        expect(TodoApp.todoList(0).isCompleted).to.equal(true);
      });
    });

    describe("clicking the all filter", () => {
      beforeEach(async () => {
        await TodoApp.clickAllFilter();
      });

      it("displays all todos", () => {
        expect(TodoApp.todoList().length).to.equal(2);
      });

      it("displays the proper completed todo", () => {
        expect(TodoApp.todoList(0).todoText).to.equal("Filter Todo");
      });
    });
  });
});
