# Todo API

A lightweight **REST API** for managing todo tasks, built with [Fastify](https://fastify.dev/) and TypeScript. It ships with auto-generated **Swagger / OpenAPI docs** out of the box.

---

## What is this?

A CRUD API that lets you create, read, update, and delete todo tasks. Tasks are stored **in-memory** (no database required), so it's ready to run with zero configuration. The API exposes:

- A root info endpoint
- A health-check endpoint
- Full CRUD on `/tasks`
- Interactive Swagger UI at `/docs`

> [!WARNING]
> **Data does not persist across restarts.** Tasks live in RAM, so every time the server restarts it resets to the three built-in seed tasks below. Any tasks you created during the previous session will be gone.
>
> Default seed tasks on every fresh start:
> | id | title | done |
> |----|-------|------|
> | 1 | Complete Assignment 1 | false |
> | 2 | Complete Assignment 2 | false |
> | 3 | Complete Assignment 3 | false |

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| pnpm | ≥ 8 |

---

## Install & Run

One command — clone, install, build, and start:

```bash
git clone https://github.com/Raqibreyaz/Todo-App.git && \
  cd Todo-App && \
  pnpm install && \
  pnpm build && \
  pnpm start
```

The server starts on **http://localhost:3000**.  
Interactive docs are at **http://localhost:3000/docs**.

> **Tip:** For development with hot-reload, use `pnpm dev` after building once.

---

## Endpoints

| Method | Path | Description | Request Body | Success |
|--------|------|-------------|--------------|---------|
| `GET` | `/` | API info & available endpoints | — | `200` |
| `GET` | `/health` | Health check | — | `200 { status: "OK" }` |
| `GET` | `/tasks` | List all todos | — | `200 Task[]` |
| `GET` | `/tasks/:id` | Get a single todo by ID | — | `200 Task` |
| `POST` | `/tasks` | Create a new todo | `{ "title": string }` | `201 Task` |
| `PUT` | `/tasks/:id` | Update title and/or done status | `{ "title"?: string, "done"?: boolean }` | `200 Task` |
| `DELETE` | `/tasks/:id` | Delete a todo by ID | — | `204 No Content` |

### Task schema

```json
{
  "id":    1,
  "title": "Complete Assignment 1",
  "done":  false
}
```

---

## curl -i Example

```
$ curl -i -X PUT http://localhost:3000/tasks/3 \
    -H "Content-Type: application/json" \
    -d '{"title":"Bring Milk","done":true}'

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
content-length: 41
Date: Tue, 27 Oct 2026 19:52:28 GMT
Connection: keep-alive
Keep-Alive: timeout=72

{"id":3,"title":"Bring Milk","done":true}
```

Other quick examples:

```bash
# List all tasks
curl -i http://localhost:3000/tasks

# Create a task
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# Delete task 2
curl -i -X DELETE http://localhost:3000/tasks/2
```

---

## Swagger UI

Interactive API documentation is auto-generated and available at:

```
http://localhost:3000/docs
```

![Swagger UI showing all Todo API endpoints](./Swagger-UI-Page.png)

---

## Project Structure

```
Todo-App/
├── app.ts            # Entry point — registers Swagger & routes
├── src/
│   └── routes/
│       └── tasks.ts  # All /tasks CRUD handlers + OpenAPI schemas
├── tsconfig.json
└── package.json
```

---

## License

ISC