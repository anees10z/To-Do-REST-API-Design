const dotEnv = require("dotenv").config();
const express = require("express");
const app = express();

const Port = process.env.PORT;

app.get("/", (req, res) => {
  //   res.send("Hello FlyRank");
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

app.listen(Port, () => {
  console.log(`Server Listening on PORT: ${Port}`);
});
