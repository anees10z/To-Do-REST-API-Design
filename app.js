const dotEnv = require("dotenv").config();
const express = require("express");
const app = express();

const Port = process.env.PORT;

// Middleware to parse JSON request bodies
app.use(express.json());

// Tasks array to store the tasks
let tasks = [
  {
    id: 1,
    title: "Learn HTTP",
    done: false,
  },
  {
    id: 2,
    title: "Build API",
    done: false,
  },
  {
    id: 3,
    title: "Push to GitHub",
    done: false,
  },
];

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
    status: "ok",
  });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  let id = Number(req.params.id);

  let task = tasks.find((task) => task.id === id);

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

  let newId = 1;

  while (tasks.some((task) => task.id === newId)) {
    newId++;
  }

  const newTask = {
    id: newId,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Put route to update a task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  // Task not found
  if (index === -1) {
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

  // Update title
  if (title !== undefined) {
    tasks[index].title = title.trim();
  }

  // Update done
  if (done !== undefined) {
    tasks[index].done = done;
  }

  res.status(200).json(tasks[index]);
});

// Delete route to delete a task
app.delete("/tasks/:id", (req, res) => {
  let id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`,
    });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// server listening on port
app.listen(Port, () => {
  console.log(`Server Listening on PORT: ${Port}`);
});
