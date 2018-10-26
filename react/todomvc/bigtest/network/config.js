import { API_URL } from "../../src/api";

export default function configure() {
  // The cypress app is not talking to a network,
  // so let's remove our network latency to match
  this.timing = 0;
  this.urlPrefix = API_URL;

  this.get("/", ({ todos }, request) => {
    return todos.all();
  });

  this.post("/", ({ todos }, request) => {
    let attrs = JSON.parse(request.requestBody);
    let todo = todos.create(attrs);

    // Make sure we return the _id attr our API expects
    todo.update({
      _id: { $oid: todo.id }
    });

    return todo;
  });

  this.patch("/:id", ({ todos }, request) => {
    let todo = todos.find(request.params.id);
    let attrs = JSON.parse(request.requestBody);

    return todo.update(attrs);
  });

  this.del("/:id", ({ todos }, request) => {
    let todo = todos.find(request.params.id);

    return todo.destroy();
  });
}
