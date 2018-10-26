import {
  text,
  interactor,
  clickable,
  property,
  fillable,
  triggerable,
  isPresent,
  blurrable
} from "@bigtest/interactor";

@interactor
class TodoItem {
  todoText = text("label");
  toggle = clickable(".toggle");
  delete = clickable(".destroy");
  toggleIsPresent = isPresent(".toggle");
  deleteIsPresent = isPresent(".destroy");
  isCompleted = property(".toggle", "checked");
  doubleClick = triggerable("label", "dblclick");
  fillInput = fillable(".edit");
  blurInput = blurrable(".edit");

  pressEscape = triggerable(".edit", "keydown", {
    keyCode: 27
  });

  pressEnter = triggerable(".edit", "keydown", {
    keyCode: 13
  });
}

export default TodoItem;
