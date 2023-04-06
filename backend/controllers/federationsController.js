const pool = require("../database/database");
async function list_federations(req, res) {
  try {
    const listOfFederations = await pool.query(
      "SELECT * FROM federations ORDER BY federation_state ASC"
    );
    res.json(listOfFederations.rows);
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { list_federations };
