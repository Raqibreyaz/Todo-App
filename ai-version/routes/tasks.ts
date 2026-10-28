import type { FastifyPluginAsync } from 'fastify';
import { taskStore } from '../store.js';
import type {
  CreateTaskBody,
  TaskParams,
  TaskQuery,
  UpdateTaskBody
} from '../types.js';
import {
  createTaskSchema,
  deleteTaskSchema,
  getAllTasksSchema,
  getTaskByIdSchema,
  getTaskStatsSchema,
  resetTasksSchema,
  updateTaskSchema
} from '../schemas.js';

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /tasks - List all todos with search and done filters
  fastify.get<{ Querystring: TaskQuery }>(
    '/',
    { schema: getAllTasksSchema },
    async (request, reply) => {
      let doneFilter: boolean | undefined = undefined;
      if (typeof request.query.done === 'boolean') {
        doneFilter = request.query.done;
      } else if (typeof request.query.done === 'string') {
        if (request.query.done === 'true') doneFilter = true;
        else if (request.query.done === 'false') doneFilter = false;
      }

      const tasks = taskStore.getAll({
        search: request.query.search,
        done: doneFilter
      });
      return reply.status(200).send(tasks);
    }
  );

  // POST /tasks - Create a new todo
  fastify.post<{ Body: CreateTaskBody }>(
    '/',
    { schema: createTaskSchema },
    async (request, reply) => {
      const task = taskStore.create(request.body.title);
      return reply.status(201).send(task);
    }
  );

  // GET /tasks/stats - Get task statistics (registered before :id)
  fastify.get(
    '/stats',
    { schema: getTaskStatsSchema },
    async (_request, reply) => {
      const stats = taskStore.getStats();
      return reply.status(200).send(stats);
    }
  );

  // POST /tasks/reset - Reset tasks to the initial 3 (registered before :id)
  fastify.post(
    '/reset',
    { schema: resetTasksSchema },
    async (_request, reply) => {
      const tasks = taskStore.reset();
      return reply.status(200).send(tasks);
    }
  );

  // GET /tasks/:id - Fetch single todo by ID
  fastify.get<{ Params: TaskParams }>(
    '/:id',
    { schema: getTaskByIdSchema },
    async (request, reply) => {
      const task = taskStore.getById(request.params.id);
      if (!task) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.status(200).send(task);
    }
  );

  // PUT /tasks/:id - Update todo by ID
  fastify.put<{ Params: TaskParams; Body: UpdateTaskBody }>(
    '/:id',
    { schema: updateTaskSchema },
    async (request, reply) => {
      const body = request.body;
      if (!body || (body.title === undefined && body.done === undefined)) {
        return reply
          .status(400)
          .send({ message: 'Bad request: nothing to update' });
      }

      const updated = taskStore.update(request.params.id, {
        title: body.title,
        done: body.done
      });

      if (!updated) {
        return reply.status(404).send({ message: 'Task not found' });
      }

      return reply.status(200).send(updated);
    }
  );

  // DELETE /tasks/:id - Delete todo by ID
  fastify.delete<{ Params: TaskParams }>(
    '/:id',
    { schema: deleteTaskSchema },
    async (request, reply) => {
      const deleted = taskStore.delete(request.params.id);
      if (!deleted) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.status(204).send();
    }
  );
};
