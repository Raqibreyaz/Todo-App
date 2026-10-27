import type { FastifyPluginAsync } from "fastify";

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface UpdateBody {
  title?: string;
  done?: boolean;
}

interface IdParam {
  id: string;
}

let nextId = 4;
const tasks: Task[] = [
  { id: 1, title: "Complete Assignment 1", done: false },
  { id: 2, title: "Complete Assignment 2", done: false },
  { id: 3, title: "Complete Assignment 3", done: false },
];

const taskRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Todos"],
        summary: "Get all Todos",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                title: { type: "string" },
                done: { type: "boolean" },
              },
              required: ["id", "title", "done"],
            },
          },
        },
      },
    },
    () => tasks,
  );

  app.get<{ Params: IdParam }>(
    "/:id",
    {
      schema: {
        tags: ["Todos"],
        summary: "Get a todo",
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              done: { type: "boolean" },
            },
            required: ["id", "title", "done"],
          },
        },
      },
    },
    (request, reply) => {
      const { id } = request.params;
      const taskId = Number(id);

      const task = tasks.find((task) => task.id === taskId);

      if (!task) {
        return reply.code(404).send({ error: `Task ${id} not found.` });
      }

      return task;
    },
  );

  app.post<{ Body: { title: string } }>(
    "/",
    {
      schema: {
        tags: ["Todos"],
        summary: "Create a todo",
        body: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              description: "Title of the todo",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              done: { type: "boolean" },
            },
            required: ["id", "title", "done"],
          },
        },
      },
    },
    (request, reply) => {
      const { title } = request.body;

      if (!title) {
        return reply.code(400).send({ error: "Title is required." });
      }

      tasks.push({ id: nextId++, done: false, title });

      return reply.code(201).send(tasks[tasks.length - 1]);
    },
  );

  app.put<{
    Body: UpdateBody;
    Params: IdParam;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Todos"],
        summary: "Update a todo",
        body: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              description: "Title of the todo",
            },
            done: {
              type: "boolean",
              description: "Status of the todo",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              done: { type: "boolean" },
            },
            required: ["id", "title", "done"],
          },
        },
      },
    },
    (request, reply) => {
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
    },
  );

  app.delete<{
    Params: IdParam;
  }>(
    "/:id",
    {
      schema: {
        tags: ["Todos"],
        summary: "Delete a todo",
      },
    },
    (request, reply) => {
      const taskId = Number(request.params.id);
      const taskIndex = tasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) {
        return reply.code(404).send({ error: "Task doesn't exist." });
      }

      tasks.splice(taskIndex, 1);

      return reply.code(204).send();
    },
  );
};

export default taskRoutes;
