import type { FastifyPluginAsync } from 'fastify';
import { healthSchema, rootSchema } from '../schemas.js';

export const generalRoutes: FastifyPluginAsync = async (fastify) => {
  // GET / - Root info
  fastify.get('/', { schema: rootSchema }, async (_request, reply) => {
    return reply.status(200).send({
      name: 'Todo API',
      version: '1.0.0',
      endpoints: [
        'GET /',
        'GET /health',
        'GET /tasks',
        'POST /tasks',
        'GET /tasks/stats',
        'POST /tasks/reset',
        'GET /tasks/:id',
        'PUT /tasks/:id',
        'DELETE /tasks/:id',
        'GET /docs'
      ]
    });
  });

  // GET /health - Health check returning 200 "OK"
  fastify.get('/health', { schema: healthSchema }, async (request, reply) => {
    if (
      request.headers.accept &&
      request.headers.accept.includes('application/json') &&
      !request.headers.accept.includes('*/*')
    ) {
      return reply.status(200).send({ status: 'OK' });
    }
    return reply.status(200).send('OK');
  });
};
