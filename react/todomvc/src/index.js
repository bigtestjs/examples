import React from "react";
import { render } from "react-dom";
import TodoMVC from "./components/TodoMVC";
import "./style.css";

let save = value =>
  localStorage.setItem("microstates-todomvc", JSON.stringify(value));

render(<TodoMVC value={{}} onChange={save} />, document.getElementById("root"));
