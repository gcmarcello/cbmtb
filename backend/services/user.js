const pool = require("../database/database");

async function readUserFromId(id) {
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  return user.rows[0] ?? null;
}

module.exports = { readUserFromId };
