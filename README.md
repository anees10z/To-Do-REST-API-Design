# 🚀 To-Do REST API — PostgreSQL + Docker

A production-style **Task REST API** built with **Node.js, Express.js, PostgreSQL, Docker and Docker Compose**.

This project is **FlyRank Internship · Backend Track · Containerize your stack**.

The project is the third storage implementation of the same Task API:

- **A1:** In-memory storage
- **A2:** SQLite storage
- **A3:** PostgreSQL running in Docker

The API keeps the same CRUD behaviour while the storage layer is moved to a real PostgreSQL database. The complete application stack can be started with a single command:

```bash
docker compose up
```

---

## ✨ Features

- ✅ Create a new task
- ✅ Get all tasks
- ✅ Get a task by ID
- ✅ Update a task
- ✅ Delete a task
- ✅ Request validation
- ✅ JSON error responses
- ✅ Correct HTTP status codes
- ✅ PostgreSQL database
- ✅ PostgreSQL running inside Docker
- ✅ Automatic `tasks` table creation
- ✅ Three seed tasks on first run only
- ✅ Parameterized PostgreSQL queries using `pg`
- ✅ Docker volume for persistent database data
- ✅ Docker Compose for the complete stack
- ✅ PostgreSQL health check
- ✅ `.env` based configuration
- ✅ `.env` ignored by Git
- ✅ `.env.example` included for setup
- ✅ Git/GitHub workflow

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| JavaScript | Application language |
| PostgreSQL 17 | Relational database |
| `pg` | Node.js PostgreSQL driver |
| Docker | Container platform |
| Docker Compose | Runs API and database together |
| dotenv / environment variables | Configuration and secrets |
| Git & GitHub | Version control and publishing |
| curl | API testing |

---

# 📂 Project Structure

```text
To-Do-REST-API-Design/
│
├── docs/
│   ├── api-crud-tests.png
│   ├── api-get-tasks.PNG
│   ├── docker-compose-up.PNG
│   ├── postgresql-data.png
│   └── postgresql-tables.png
│
├── app.js
├── db.js
├── swaggerSpec.js
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> **Security note:** `.env` is intentionally not included in Git. It contains local configuration/secrets and is ignored by `.gitignore`.

---

# 🐳 Docker Compose

The complete application contains two services:

```text
                 Docker Compose
                       │
             ┌─────────┴─────────┐
             │                   │
          API service        PostgreSQL
             │                   │
       Node + Express       postgres:17
             │                   │
             └─────── db ────────┘
                       │
                 taskdata volume
```

- `api` builds the Node.js application from the `Dockerfile`.
- `db` runs PostgreSQL 17.
- The API reaches PostgreSQL using the Compose service name `db`.
- The named `taskdata` volume keeps database rows after containers are stopped and recreated.
- A PostgreSQL health check prevents the API from starting before the database is ready.

---

# 🔐 Environment Variables

The project uses environment variables instead of hardcoding database credentials in the application configuration.

Create your local `.env` from the example:

```bash
cp .env.example .env
```

The `.env.example` file contains the required keys:

```env
PORT=3000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/tasks
POSTGRES_PASSWORD=YOUR_PASSWORD
DATABASE_URL_DOCKER=postgres://postgres:YOUR_PASSWORD@db:5432/tasks
```

### Why are there two database URLs?

When the Node application runs directly on the host machine, PostgreSQL is reached through:

```text
localhost:5432
```

When the API runs inside Docker Compose, it must reach the database through the Compose service name:

```text
 db:5432
```

Therefore:

- `DATABASE_URL` is for the local/host configuration.
- `DATABASE_URL_DOCKER` is used by the API container.

The real `.env` file is ignored by Git and must never be committed.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

## 2. Enter the project

```bash
cd To-Do-REST-API-Design
```

## 3. Create the environment file

```bash
cp .env.example .env
```

Edit `.env` if necessary and set your local PostgreSQL password value.

---

# ▶️ Run the Complete Stack

The main A3 requirement is to start the whole application with one command.

```bash
docker compose up
```

To rebuild the application image after code changes:

```bash
docker compose up --build
```

The API is available at:

```text
http://localhost:3000
```

The PostgreSQL service is available inside the Compose network as:

```text
db:5432
```

The host-facing API port is:

```text
3000
```

---

## 🖼️ Docker Compose Running

The following screenshot shows the API and PostgreSQL services running through Docker Compose.

![Docker Compose Running](./docs/docker-compose-up.PNG)

---

# 🗄️ PostgreSQL Database

The database used by this project is named:

```text
tasks
```

The application automatically creates the `tasks` table if it does not already exist.

### Database schema

| Column | PostgreSQL Type | Description |
|---|---|---|
| `id` | `SERIAL` | Primary key and unique task ID |
| `title` | `TEXT` | Task title |
| `done` | `BOOLEAN` | Task completion status |

The table is created with the equivalent structure:

```sql
CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title TEXT,
    done BOOLEAN
);
```

---

## 🌱 Seed Data

On startup, the application checks whether the `tasks` table is empty.

If it is empty, three example tasks are inserted:

```text
1. Learn HTTP
2. Build API
3. Push to GitHub
```

The seed operation happens **only when the table contains zero rows**. Restarting the application does not create duplicate seed tasks.

---

## 📋 PostgreSQL Tables

The database table was verified using `psql` with `\dt`.

![PostgreSQL Tables](./docs/postgresql-tables.png)

---

## 📊 PostgreSQL Data

The seeded task rows were verified using:

```sql
SELECT * FROM tasks;
```

![PostgreSQL Data](./docs/postgresql-data.png)

---

# 🔗 API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/` | API information | `200` |
| GET | `/health` | API health check | `200` |
| GET | `/tasks` | Get all tasks | `200` |
| GET | `/tasks/:id` | Get a task by ID | `200` |
| POST | `/tasks` | Create a task | `201` |
| PUT | `/tasks/:id` | Update a task | `200` |
| DELETE | `/tasks/:id` | Delete a task | `204` |

### Error status codes

| Status | Meaning |
|---|---|
| `400` | Invalid request body |
| `404` | Task not found |

Errors are returned as JSON, for example:

```json
{
  "error": "Task not found"
}
```

---

# 📝 Task Object

A task has this structure:

```json
{
  "id": 1,
  "title": "Learn HTTP",
  "done": false
}
```

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Unique task identifier |
| `title` | String | Task title |
| `done` | Boolean | Whether the task is completed |

---

# 🧪 API Testing

## 1. Get All Tasks

```bash
curl -i http://localhost:3000/tasks
```

Expected status:

```text
HTTP/1.1 200 OK
```

Example response:

```json
[
  {
    "id": 1,
    "title": "Learn HTTP",
    "done": false
  },
  {
    "id": 2,
    "title": "Build API",
    "done": false
  },
  {
    "id": 3,
    "title": "Push to GitHub",
    "done": false
  }
]
```

![GET Tasks](./docs/api-get-tasks.PNG)

---

## 2. Get Task by ID

```bash
curl -i http://localhost:3000/tasks/1
```

Expected status:

```text
HTTP/1.1 200 OK
```

Example response:

```json
{
  "id": 1,
  "title": "Learn HTTP",
  "done": false
}
```

For an unknown ID:

```bash
curl -i http://localhost:3000/tasks/9999
```

Expected response:

```text
HTTP/1.1 404 Not Found
```

```json
{
  "error": "Task not found"
}
```

---

## 3. Create a Task

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker Practice","done":false}'
```

Expected status:

```text
HTTP/1.1 201 Created
```

The API inserts the task using a parameterized PostgreSQL query and returns the newly created row.

---

## 4. Update a Task

```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker Practice Updated","done":true}'
```

Expected status:

```text
HTTP/1.1 200 OK
```

An unknown ID returns:

```text
HTTP/1.1 404 Not Found
```

```json
{
  "error": "Task not found"
}
```

---

## 5. Delete a Task

```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```

Expected status:

```text
HTTP/1.1 204 No Content
```

A successful delete has an empty response body.

---

## 6. CRUD Status-Code Evidence

The complete CRUD testing evidence is shown below.

![CRUD API Tests](./docs/api-crud-tests.png)

The tested success/error statuses are:

```text
POST   → 201 Created
PUT    → 200 OK
DELETE → 204 No Content
GET unknown task → 404 Not Found
```

---

# 🔒 Validation & Error Handling

The API validates incoming task data before writing to PostgreSQL.

For example, a missing or empty title is rejected with:

```text
400 Bad Request
```

Example:

```json
{
  "error": "Title is required"
}
```

Unknown task IDs return:

```text
404 Not Found
```

with:

```json
{
  "error": "Task not found"
}
```

---

# 🛡️ Parameterized SQL Queries

The application uses the `pg` driver and PostgreSQL parameterized queries.

For example, retrieving a task by ID uses the PostgreSQL placeholder `$1` rather than directly inserting user input into SQL:

```js
pool.query(
  "SELECT * FROM tasks WHERE id = $1",
  [id]
);
```

Creating a task uses parameters and returns the inserted row:

```sql
INSERT INTO tasks (title, done)
VALUES ($1, $2)
RETURNING *
```

This keeps user-supplied values separate from the SQL statement.

---

# 🏗️ Application Architecture

```text
Client
  │
  ▼
HTTP Request
  │
  ▼
Express API
  │
  ▼
Database Module (db.js)
  │
  ▼
pg Pool
  │
  ▼
PostgreSQL
  │
  ▼
tasks table
  │
  ▼
JSON Response
```

The database-related code is kept in `db.js`, while the API routes remain focused on handling HTTP requests and responses.

This makes the storage implementation an implementation detail underneath the API.

---

# 🐳 Dockerfile

The application image is built using the project `Dockerfile`.

The Dockerfile:

1. Starts from a Node.js base image.
2. Sets `/app` as the working directory.
3. Copies the package files.
4. Installs dependencies.
5. Copies the application source.
6. Exposes port `3000`.
7. Starts the application with `node app.js`.

The PostgreSQL database uses the official PostgreSQL Docker image.

---

# 💾 Persistence with Docker Volume

PostgreSQL data is stored in a named Docker volume:

```yaml
volumes:
  taskdata:
```

The database container mounts it at:

```text
/var/lib/postgresql/data
```

This means database rows survive a container restart.

The persistence flow is:

```text
Create tasks
    ↓
docker compose down
    ↓
docker compose up
    ↓
PostgreSQL starts again
    ↓
Same task rows are still present
```

Without a persistent volume, deleting the database container could remove the database's stored data.

---

# 🩺 PostgreSQL Health Check

The Compose database service includes a health check:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres -d tasks"]
  interval: 5s
  timeout: 5s
  retries: 5
```

The API waits for the database service to become healthy before starting:

```yaml
depends_on:
  db:
    condition: service_healthy
```

This avoids the API trying to connect before PostgreSQL is ready to accept connections.

---

# 🔄 Storage Evolution: A1 → A2 → A3

| Assignment | Storage | Persistence |
|---|---|---|
| A1 | In-memory list | Lost on application restart |
| A2 | SQLite `tasks.db` | Stored in a local file |
| A3 | PostgreSQL in Docker | Database server + Docker volume |

The important point is that the API behaviour stays the same while the storage implementation changes underneath it.

---

# 🧰 Useful Docker Commands

### Start the complete stack

```bash
docker compose up
```

### Start in the background

```bash
docker compose up -d
```

### Rebuild the API image

```bash
docker compose up --build
```

### See running containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

### Stop the stack

```bash
docker compose down
```

> Do not use `docker compose down -v` when you want to preserve the PostgreSQL volume.

### Open PostgreSQL `psql`

```bash
docker compose exec db psql -U postgres -d tasks
```

Inside `psql`:

```sql
\dt
SELECT * FROM tasks;
```

Exit with:

```sql
\q
```

---

# 🧪 Clean Clone Verification

A fresh clone should be able to run the application without manually installing PostgreSQL or creating the database.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd To-Do-REST-API-Design
cp .env.example .env
docker compose up
```

Then test:

```bash
curl -i http://localhost:3000/tasks
```

The API should return the seeded tasks.

No manual PostgreSQL installation or database setup is required because PostgreSQL is supplied by Docker Compose.

---

# 📸 A3 Evidence

The repository contains evidence for the containerized PostgreSQL stack:

### Docker Compose

![Docker Compose](./docs/docker-compose-up.PNG)

### PostgreSQL tables

![PostgreSQL Tables](./docs/postgresql-tables.png)

### PostgreSQL data

![PostgreSQL Data](./docs/postgresql-data.png)

### GET `/tasks`

![GET Tasks](./docs/api-get-tasks.PNG)

### CRUD tests

![CRUD Tests](./docs/api-crud-tests.png)

---

# 📌 Assignment Stage History

The project was developed progressively according to the A3 stages:

| Stage | Work |
|---|---|
| Stage 0 | PostgreSQL in Docker + Git ignore configuration |
| Stage 1 | PostgreSQL connection through environment configuration + automatic table/seed setup |
| Stage 2 | GET endpoints backed by PostgreSQL |
| Stage 3 | Full CRUD operations on PostgreSQL |
| Stage 4 | Dockerfile + Docker Compose for the complete stack |
| Stage 5 | One-command stack + documentation + GitHub publishing |

---

# 🎯 Assignment Requirements Covered

- ✅ PostgreSQL runs in a container.
- ✅ Complete stack starts with `docker compose up`.
- ✅ Database configuration comes from environment variables.
- ✅ `.env` is ignored by Git.
- ✅ `.env.example` is committed with placeholder values.
- ✅ No database password is hardcoded in `compose.yaml`.
- ✅ `tasks` table is created automatically if missing.
- ✅ Three example tasks are seeded only when the table is empty.
- ✅ Five required CRUD task endpoints work against PostgreSQL.
- ✅ Parameterized PostgreSQL queries are used.
- ✅ `200`, `201`, `204`, `400`, and `404` responses are handled.
- ✅ Errors are returned as JSON.
- ✅ Docker volume provides database persistence.
- ✅ README documents the one-command startup.
- ✅ Endpoint table is included.
- ✅ `curl -i` testing is documented.
- ✅ PostgreSQL database screenshot evidence is included.
- ✅ Project is maintained in the same GitHub repository used for A1/A2.

---

# 📚 Key Concepts Learned

### Docker Image
A frozen recipe containing a program and everything needed to run it.

### Container
A running instance of a Docker image.

### PostgreSQL
A relational database server used to store the task rows.

### Volume
Persistent storage that allows PostgreSQL data to survive container restarts.

### Docker Compose
A tool for defining and starting multiple services together.

### `.env`
A local environment configuration file containing values such as database credentials.

### `.env.example`
A safe template showing which environment variables another developer must provide.

### Parameterized Query
A SQL query that uses placeholders such as `$1` and passes values separately.

### Seed
Initial example data inserted when the database table is empty.

### CRUD
Create, Read, Update and Delete — the four core database operations implemented by the API.

---

# 👨‍💻 Git Workflow

Each major assignment stage was committed separately so the project history shows the development progression.

Example:

```bash
git log --oneline
```

The repository contains the A1/A2 history as well as the A3 stage commits.

---

# 📄 License

This project was created as part of the **FlyRank Internship Backend Track **.
