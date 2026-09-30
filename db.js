const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks(
      id SERIAL PRIMARY KEY,
      title TEXT,
      done BOOLEAN
    )
  `);

  const result = await pool.query(
    "SELECT COUNT(*) AS count FROM tasks"
  );

  if (Number(result.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done)
      VALUES
        ($1, $2),
        ($3, $4),
        ($5, $6)
    `, [
      "Learn HTTP", false,
      "Build API", false,
      "Push to GitHub", false
    ]);

    console.log("3 seed tasks inserted.");
  }

  console.log("Database initialized successfully");
}

module.exports = {
  pool,
  initializeDatabase
};