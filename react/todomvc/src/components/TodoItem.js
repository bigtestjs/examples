import classnames from "classnames";
import React, { Component } from "react";
import TodoTextInput from "./TodoTextInput";

export default class TodoItem extends Component {
  render() {
    let { todo, onToggle, onEdit, onDelete } = this.props;

    return (
      <li
        className={classnames({
          completed: todo.completed.state,
          editing: todo.editing.state
        })}
        key={todo.id.state}
      >
        {todo.editing.state ? (
          <TodoTextInput
            text={todo.text.state}
            classes="edit"
            onSave={text => onEdit(text, todo)}
            onBlur={text => onEdit(text, todo)}
            onInputChange={todo.text.set}
          />
        ) : (
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={todo.completed.state}
              onChange={() => onToggle(todo)}
            />
            <label onDoubleClick={todo.startEditing}>{todo.text.state}</label>
            <button className="destroy" onClick={() => onDelete(todo)} />
          </div>
        )}
      </li>
    );
  }
}
