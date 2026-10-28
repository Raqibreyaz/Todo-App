import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import taskRoutes from "./routes/tasks.js";

const app = Fastify({ logger: false });

await app.register(swagger, {
  openapi: {
    info: {
      title: "Todo API",
      description: "My first fastify API documentation",
      version: "1.0.0",
    },
  },
});

await app.register(swaggerUI, { routePrefix: "/docs" });

await app.register(taskRoutes, { prefix: "/tasks" });

app.get("/", () => ({
  name: "Task API",
  version: "1.0",
  endpoints: ["/tasks"],
}));

app.get("/health", () => ({ status: "OK" }));

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error("Server failed to start.");
  process.exit(1);
}
