import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/", (_request, _reply) => {
  return {
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  };
});

app.get("/health", () => ({ status: "OK" }));

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error("Server failed to start.");
  process.exit(1);
}
