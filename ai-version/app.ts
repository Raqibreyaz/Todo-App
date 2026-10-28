import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify, { type FastifyInstance } from 'fastify';
import { fileURLToPath } from 'node:url';
import { generalRoutes } from './routes/general.js';
import { taskRoutes } from './routes/tasks.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
    routerOptions: {
      ignoreTrailingSlash: true
    },
    ajv: {
      customOptions: {
        strict: false
      }
    }
  });

  // Register Swagger (OpenAPI specification)
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Todo API',
        description: 'My first fastify API documentation',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server'
        }
      ],
      tags: [
        { name: 'Todos', description: 'Todo operations' },
        { name: 'default', description: 'General operations' }
      ]
    }
  });

  // Register Swagger UI at /docs
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });

  // Register routes
  await app.register(generalRoutes);
  await app.register(taskRoutes, { prefix: '/tasks' });

  return app;
}

export async function startServer(): Promise<FastifyInstance> {
  const app = await buildApp();
  try {
    const address = await app.listen({ port: 3000, host: '0.0.0.0' });
    app.log.info(`Server running at ${address}`);
    app.log.info(
      `Swagger UI documentation available at http://localhost:3000/docs`
    );
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Start server if executed directly
const isMain =
  process.argv[1] !== undefined &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
    import.meta.url.endsWith(process.argv[1]));

if (isMain) {
  startServer();
}
