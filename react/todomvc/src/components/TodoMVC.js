import "babel-polyfill";
import classnames from "classnames";
import { map, create, Store } from "microstates";
import React, { Component } from "react";

import TodoMVC from "../models/TodoMVC";
import TodoItem from "./TodoItem";
import TodoTextInput from "./TodoTextInput";
import { fetchTodos, apiRequest } from "../api.js";
import "../style.css";

const pluralize = (word, count) => (count === 1 ? word : `${word}s`);

export default class TodoMVC_Component extends Component {
  onUpdate = store => {
    if (!this.state) {
      return;
    }

    this.setState({ store });

    if (this.props.onChange) {
      this.props.onChange(store.state);
    }
  };

  state = {
    store: Store(create(TodoMVC, this.props.value), this.onUpdate),
    hasLoaded: false
  };

  // Fetch Data
  componentDidMount() {
    fetchTodos().then(todos => {
      this.setState({
        store: Store(create(TodoMVC, { todos }), this.onUpdate),
        hasLoaded: true
      });
    });
  }

  handleInsertNewTodo = text => {
    if (!text) return;

    apiRequest("POST", { title: text }).then(data =>
      this.state.store.insertNewTodo(data._id)
    );
  };

  handleInputChange = (...args) => this.state.store.newTodo.set(...args);

  handleEdit = (text, todo) => {
    // this is gross
    if (todo.state.text !== text) {
      todo.text.set(text);
    }

    apiRequest("PATCH", { title: text }, todo.state._id.$oid).then(() =>
      todo.stopEditing()
    );
  };

  handleDelete = todo => {
    let { store } = this.state;

    apiRequest("DELETE", {}, todo.state._id.$oid).then(() =>
      store.todos.filter(item => todo.state !== item.state)
    );
  };

  handleToggle = todo => {
    apiRequest(
      "PATCH",
      { completed: !todo.state.completed },
      todo.state._id.$oid
    ).then(() => todo.completed.toggle());
  };

  render() {
    let { store, hasLoaded } = this.state;

    return (
      <div className={classnames({ loading: !hasLoaded, todoapp: true })}>
        <header className="header">
          <h1>Todos</h1>
          <TodoTextInput
            text={store.newTodo.state}
            classes="new-todo"
            onSave={this.handleInsertNewTodo}
            onBlur={this.handleInsertNewTodo}
            onInputChange={this.handleInputChange}
            placeholder="What needs to be done?"
          />
        </header>

        <section className="main">
          {store.hasTodos && (
            <span>
              <input
                className="toggle-all"
                type="checkbox"
                checked={store.isAllComplete}
              />
              <label onClick={store.toggleAll} />
            </span>
          )}

          <ul className="todo-list">
            {map(store.filtered, todo => (
              <TodoItem
                key={todo.state.id}
                todo={todo}
                onEdit={this.handleEdit}
                onToggle={this.handleToggle}
                onDelete={this.handleDelete}
              />
            ))}
          </ul>

          {store.hasTodos && (
            <footer className="footer">
              <span className="todo-count">
                <strong>{store.active.length || "No"}</strong>{" "}
                {pluralize("item", store.active.length)}
              </span>

              <ul className="filters">
                {store.filters.map(filter => (
                  <li key={filter.key}>
                    <button
                      className={classnames({ selected: filter.selected })}
                      style={{ cursor: "pointer" }}
                      onClick={filter.select}
                    >
                      {filter.label}
                    </button>
                  </li>
                ))}
              </ul>

              {store.hasCompleted && (
                <button
                  className="clear-completed"
                  onClick={store.clearCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          )}
        </section>
      </div>
    );
  }
}
