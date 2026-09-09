const dotEnv = require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const db = require("./db");

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

app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  let id = parseInt(req.params.id);

  const task = db.prepare("SELECT * FROM tasks WHERE id =?").get(id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({
      error: `Task ${id} not found`,
    });
  }
});

// Post route to create a new task
app.post("/tasks", (req, res) => {
  const title = req.body.title;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required",
    });
  }
  const cleanTitle = title.trim();
  const stmt = db.prepare("INSERT INTO tasks (title, done) VALUES(?,?)");
  const result = stmt.run(cleanTitle, 0);

  const newTask = {
    id: result.lastInsertRowid,
    title: cleanTitle,
    done: false,
  };

  res.status(201).json(newTask);
});

// Put route to update a task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = db.prepare("SELECT  * FROM tasks WHERE id = ?").get(id);

  // Task not found
  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }

  const { title, done } = req.body;

  // Empty body
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "At least one field is required",
    });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Title must be a non-empty string",
      });
    }
  }

  // Validate done if provided
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({
        error: "Done must be a boolean",
      });
    }
  }

  // actaul updates
  const updatedTitle = title !== undefined ? title.trim() : task.title;
  const updatedDone = done !== undefined ? (done ? 1 : 0) : task.done;

  const stmt = db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?");
  stmt.run(updatedTitle, updatedDone ? 1 : 0, id);
  const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  res.status(200).json({
    id: updatedTask.id,
    title: updatedTask.title,
    done: Boolean(updatedTask.done),
  });
});

// Delete route to delete a task
app.delete("/tasks/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }
  const stmt = db.prepare("DELETE FROM tasks WHERE id =?");
  stmt.run(id);
  res.status(204).send();
});

// server listening on port
app.listen(Port, () => {
  console.log(`Server Listening on PORT: ${Port}`);
});
