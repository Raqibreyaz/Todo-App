import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/", (_request, _reply) => {
  return "HELLO";
});

try {
  await server.listen({ port: 3000 });
} catch (error) {
  server.log.error("Server failed to start.");
  process.exit(1);
}
