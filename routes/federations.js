const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");

// List Federations
router.get("/", async (req, res) => {
  try {
    const listOfFederations = await pool.query("SELECT * FROM federations ORDER BY federation_state ASC");
    res.json(listOfFederations.rows);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
