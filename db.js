const database = require("better-sqlite3");
const db = new database("tasks.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY,
        title TEXT,
        done BOOLEAN
    )
`);

// check whether the table is empty
const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

// seeds only when the table is empty
if (count.count === 0) {
  const insert = db.prepare(`
        INSERT INTO tasks (title, done) VALUES (?,?)
    `);

  insert.run("Learn HTTP", 0);
  insert.run("Build API", 0);
  insert.run("Push to GitHub", 0);

  console.log("3 seed tasks inserted.");
}
console.log("Database initialized successfully");
