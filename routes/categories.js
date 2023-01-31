const router = require("express").Router();
const pool = require("../database");
const authorization = require("./middlewares/authorization");
const adminAuthorization = require("./middlewares/adminAuthorization");

// Create Categories (ADMIN)
router.post("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryMinAge, categoryMaxAge } = req.body;
    const newCategory = await pool.query(`INSERT INTO categories (event_id,category_name,category_minage,category_maxage) VALUES ($1,$2,$3,$4)`, [
      id,
      categoryName,
      categoryMinAge,
      categoryMaxAge,
    ]);
    res.status(200).json({ message: "Categoria criada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
});

// Read Event Categories (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listOfCategories = await pool.query("SELECT * FROM categories WHERE event_id = $1 ORDER BY category_maxage ASC", [id]);
    res.json(listOfCategories.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// Update Categories (ADMIN)
router.put("/:id", adminAuthorization, async (req, res) => {});

// Delete Category
router.delete("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const removeCategory = await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);
    res.json({ message: "Categoria Removida.", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
