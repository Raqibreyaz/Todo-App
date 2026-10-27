import type { FastifyPluginAsync } from "fastify";

let nextId = 4;
const tasks = [
  { id: 1, title: "Complete Assignment 1", done: false },
  { id: 2, title: "Complete Assignment 2", done: false },
  { id: 3, title: "Complete Assignment 3", done: false },
];

const taskRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", () => tasks);

  app.get<{ Params: { id: string } }>("/:id", (request, reply) => {
    const { id } = request.params;
    const taskId = Number(id);

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return reply.code(404).send({ error: `Task ${id} not found.` });
    }

    return task;
  });

  app.post<{ Body: { title: string } }>("/", (request, reply) => {
    const { title } = request.body;

    if (!title) {
      return reply.code(400).send({ error: "Title is required." });
    }

    tasks.push({ id: nextId++, done: false, title });

    return reply.code(201).send(tasks[tasks.length - 1]);
  });

  interface UpdateBody {
    title?: string;
    done?: boolean;
  }

  app.put<{
    Body: UpdateBody;
    Params: { id: string };
  }>("/:id", (request, reply) => {
    const toUpdate: UpdateBody = {};
    const { title, done } = request.body;

    if (title) {
      toUpdate["title"] = title;
    }
    if (done != undefined) {
      toUpdate["done"] = done;
    }
    if (Object.values(toUpdate).length === 0) {
      return reply.code(400).send({ message: "Nothing to change." });
    }

    const taskId = Number(request.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    const existingTask = tasks[taskIndex];

    if (!existingTask) {
      return reply.code(404).send({ error: "Task doesn't exist." });
    }

    tasks[taskIndex] = { ...existingTask, ...toUpdate };

    return reply.code(200).send(tasks[taskIndex]);
  });

  app.delete<{
    Params: { id: string };
  }>("/:id", (request, reply) => {
    const taskId = Number(request.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return reply.code(404).send({ error: "Task doesn't exist." });
    }

    tasks.splice(taskIndex, 1);

    return reply.code(204).send();
  });
};

export default taskRoutes;
