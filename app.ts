import Fastify from "fastify";

const app = Fastify({ logger: false });

let nextId = 4;
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
    return reply.code(404).send({ error: `Task ${id} not found.` });
  }

  return task;
});

app.post<{ Body: { title: string } }>("/tasks", (request, reply) => {
  const { title } = request.body;

  if (!title) {
    return reply.code(400).send({ error: "Title is required." });
  }

  tasks.push({ id: nextId++, done: false, title });

  return reply.code(201).send(tasks[tasks.length - 1]);  
});

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error("Server failed to start.");
  process.exit(1);
}
