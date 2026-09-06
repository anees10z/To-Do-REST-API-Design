const dotEnv = require("dotenv").config();
const express = require("express");
const app = express();

const Port = process.env.PORT;

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

app.listen(Port, () => {
  console.log(`Server Listening on PORT: ${Port}`);
});
