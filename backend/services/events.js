const pool = require("../database/database");

async function readEventFromId(id) {
  const event = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);

  return event.rows[0] ?? null;
}

module.exports = { readEventFromId };
