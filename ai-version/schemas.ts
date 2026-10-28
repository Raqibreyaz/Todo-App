export const taskSchema = {
  type: 'object',
  required: ['id', 'title', 'done'],
  properties: {
    id: { type: 'integer', description: 'Unique task identifier', example: 1 },
    title: { type: 'string', description: 'Task title', example: 'Complete Assignment 1' },
    done: { type: 'boolean', description: 'Task completion status', example: false }
  }
} as const;

export const errorSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string', description: 'Error message', example: 'Task not found' }
  }
} as const;

export const getAllTasksSchema = {
  tags: ['Todos'],
  summary: 'Get all Todos',
  description: 'Retrieve all todos with optional filtering by search string and done status',
  querystring: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'Filter tasks containing this substring in their title (case-insensitive)'
      },
      done: {
        type: 'boolean',
        description: 'Filter tasks by completion status (true or false)'
      }
    },
    additionalProperties: false
  },
  response: {
    200: {
      description: 'A list of todos matching the criteria',
      type: 'array',
      items: taskSchema
    }
  }
} as const;

export const getTaskStatsSchema = {
  tags: ['Todos'],
  summary: 'Get task statistics',
  description: 'Returns total, done, and open counts of tasks',
  response: {
    200: {
      description: 'Statistics summary of tasks',
      type: 'object',
      required: ['total', 'done', 'open'],
      properties: {
        total: { type: 'integer', description: 'Total number of tasks', example: 3 },
        done: { type: 'integer', description: 'Number of completed tasks', example: 0 },
        open: { type: 'integer', description: 'Number of open/pending tasks', example: 3 }
      }
    }
  }
} as const;

export const resetTasksSchema = {
  tags: ['Todos'],
  summary: 'Reset tasks',
  description: 'Resets all todos back to the initial 3 seed tasks',
  response: {
    200: {
      description: 'Tasks successfully reset to the initial seed',
      type: 'array',
      items: taskSchema
    }
  }
} as const;

export const getTaskByIdSchema = {
  tags: ['Todos'],
  summary: 'Get a todo',
  description: 'Fetch and return a single todo by its ID',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer', description: 'Task numeric ID' }
    }
  },
  response: {
    200: {
      description: 'Task found',
      ...taskSchema
    },
    404: {
      description: 'Task not found',
      ...errorSchema
    }
  }
} as const;

export const createTaskSchema = {
  tags: ['Todos'],
  summary: 'Create a todo',
  description: 'Create a new todo with a required title and initial done status of false',
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', minLength: 1, description: 'Title of the new task' }
    },
    additionalProperties: false
  },
  response: {
    201: {
      description: 'Task created successfully',
      ...taskSchema
    },
    400: {
      description: 'Bad request if title is missing or empty',
      ...errorSchema
    }
  }
} as const;

export const updateTaskSchema = {
  tags: ['Todos'],
  summary: 'Update a todo',
  description: 'Update any value (title or done) of a todo by ID. Returns bad request if no values are provided.',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer', description: 'Task numeric ID' }
    }
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, description: 'Updated title' },
      done: { type: 'boolean', description: 'Updated done status' }
    },
    additionalProperties: false
  },
  response: {
    200: {
      description: 'Task updated successfully',
      ...taskSchema
    },
    400: {
      description: 'Bad request if nothing provided to update',
      ...errorSchema
    },
    404: {
      description: 'Task not found',
      ...errorSchema
    }
  }
} as const;

export const deleteTaskSchema = {
  tags: ['Todos'],
  summary: 'Delete a todo',
  description: 'Delete a todo by its numeric ID. Returns 204 No Content on success or 404 if not found.',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer', description: 'Task numeric ID' }
    }
  },
  response: {
    204: {
      description: 'Task deleted successfully (no content)',
      type: 'null'
    },
    404: {
      description: 'Task not found',
      ...errorSchema
    }
  }
} as const;

export const rootSchema = {
  tags: ['default'],
  summary: 'Get API info',
  description: 'Returns API version, endpoints list, and server API name',
  response: {
    200: {
      description: 'Server API information and available endpoints',
      type: 'object',
      required: ['name', 'version', 'endpoints'],
      properties: {
        name: { type: 'string', example: 'Todo API' },
        version: { type: 'string', example: '1.0.0' },
        endpoints: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
} as const;

export const healthSchema = {
  tags: ['default'],
  summary: 'Health check',
  description: 'Health check returning 200 OK',
  response: {
    200: {
      description: 'Health check OK',
      type: 'string',
      example: 'OK'
    }
  }
} as const;
