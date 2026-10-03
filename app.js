const dotEnv = require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const { pool, initializeDatabase } = require("./db");

const express = require("express");
const app = express();

const swaggerSpec = require("./swaggerSpec");

const Port = process.env.PORT;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Get routes
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "Ok",
  });
});

app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
});

app.get("/tasks/:id", async (req, res) => {
  let id = parseInt(req.params.id);

  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  const task = result.rows[0];

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({
      error: `Task not found`,
    });
  }
});

// Post route to create a new task
app.post("/tasks", async (req, res) => {
  const title = req.body.title;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const cleanTitle = title.trim();

  const result = await pool.query(
    `INSERT INTO tasks (title, done)
     VALUES ($1, $2)
     RETURNING *`,
    [cleanTitle, false],
  );

  res.status(201).json(result.rows[0]);
});

// Put route to update a task
app.put("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  const task = result.rows[0];

  if (!task) {
    return res.status(404).json({
      error: `Task not found`,
    });
  }

  const { title, done } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "At least one field is required",
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Title must be a non-empty string",
      });
    }
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({
        error: "Done must be a boolean",
      });
    }
  }

  const updatedTitle = title !== undefined ? title.trim() : task.title;

  const updatedDone = done !== undefined ? done : task.done;

  const updateResult = await pool.query(
    `UPDATE tasks
     SET title = $1, done = $2
     WHERE id = $3
     RETURNING *`,
    [updatedTitle, updatedDone, id],
  );

  res.status(200).json(updateResult.rows[0]);
});

// Delete route to delete a task
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

  const task = result.rows[0];

  if (!task) {
    return res.status(404).json({
      error: `Task not found`,
    });
  }

  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

  res.status(204).send();
});

// server start here
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(Port, () => {
      console.log(`Server Listening on PORT: ${Port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();
