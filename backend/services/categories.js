const pool = require("../database/database");

async function readCategoryFromId(id) {
  const category = await pool.query(
    "SELECT * FROM event_categories WHERE category_id = $1",
    [id]
  );

  return category.rows[0] ?? null;
}

module.exports = { readCategoryFromId };
