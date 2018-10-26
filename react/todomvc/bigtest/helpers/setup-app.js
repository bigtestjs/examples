import { setupAppForTesting } from "@bigtest/react";
import startMirage from "../network/start";

// Import your applications root.
// This is typically what you pass to `ReactDOM.render`
import TodoMVC from "../../src/components/TodoMVC";

export async function setupApplicationForTesting() {
  let server, app;

  app = await setupAppForTesting(TodoMVC, {
    mountId: "bigtesting-container",
    setup: () => {
      server = startMirage();
      server.logging = false;
    },
    teardown: () => {
      server.shutdown();
    }
  });

  return { app, server };
}
