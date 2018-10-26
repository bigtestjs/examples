export const API_URL = "https://bigtest-todo-api.herokuapp.com/todos";

export async function apiRequest(verb, body = {}, path = "") {
  let headers = {
    method: verb,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };

  if (verb === "GET") {
    delete headers.body;
  }

  let response = await fetch(`${API_URL}/${path}`, headers);

  return response.json();
}

export async function fetchTodos() {
  let initialTodos = await apiRequest("GET");
  let initialTodoState = initialTodos.map(todo => ({
    _id: todo._id,
    id: todo._id.$oid,
    text: todo.title,
    completed: todo.completed
  }));

  return initialTodoState;
}
