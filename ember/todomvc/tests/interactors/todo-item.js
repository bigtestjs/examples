import {
  text,
  interactor,
  clickable,
  property,
  fillable,
  triggerable,
  isVisible,
  blurrable
} from "@bigtest/interactor";

@interactor
class TodoItem {
  todoText = text(".view label");
  toggle = clickable(".view .toggle");
  delete = clickable(".view .destroy");
  labelIsVisible = isVisible(".view label");
  toggleIsVisible = isVisible(".view .toggle");
  deleteIsVisible = isVisible(".view .destroy");
  isCompleted = property(".view .toggle", "checked");
  doubleClick = triggerable(".view label", "dblclick");
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
