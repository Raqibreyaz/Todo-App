import Fastify from "fastify";
import taskRoutes from "./src/routes/tasks.js";

const app = Fastify({ logger: false });

app.get("/", () => {
  return {
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  };
});

app.get("/health", () => ({ status: "OK" }));

app.register(taskRoutes, { prefix: "/tasks" });

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error("Server failed to start.");
  process.exit(1);
}
