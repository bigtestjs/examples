export default class Todo {
  id = Number;
  text = String;
  completed = Boolean;
  editing = Boolean;
  _id = Object;

  startEditing() {
    return this.editing.set(true);
  }

  stopEditing() {
    return this.editing.set(false);
  }
}
