import Fastify from "fastify";

const app = Fastify({ logger: false });

const tasks = [
  { id: 1, title: "Complete Assignment 1", done: false },
  { id: 2, title: "Complete Assignment 2", done: false },
  { id: 3, title: "Complete Assignment 3", done: false },
];

app.get("/", () => {
  return {
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  };
});

app.get("/health", () => ({ status: "OK" }));

app.get("/tasks", () => tasks);

app.get<{ Params: { id: string } }>("/tasks/:id", (request, reply) => {
  const { id } = request.params;
  const taskId = Number(id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    reply.code(404).send({ error: `Task ${id} not found.` });
  }

  return task;
});

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error("Server failed to start.");
  process.exit(1);
}
