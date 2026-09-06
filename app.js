const dotEnv = require("dotenv").config();
const express = require("express");
const app = express();

const Port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello FlyRank");
});

app.listen(Port, () => {
  console.log(`Server Listening on PORT: ${Port}`);
});
