const pool = require("../database");

async function create_category(req, res) {
  try {
    const { id } = req.params;
    const { categoryName, categoryMinAge, categoryMaxAge, categoryGender } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO event_categories (event_id,category_name,category_minage,category_maxage, category_gender) VALUES ($1,$2,$3,$4,$5)`,
      [id, categoryName, categoryMinAge, categoryMaxAge, categoryGender]
    );
    res.status(200).json({ message: "Categoria criada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
}

async function read_event_categories_admin(req, res) {
  try {
    const { id } = req.params;
    const listOfCategories = await pool.query("SELECT * FROM event_categories WHERE event_id = $1 ORDER BY category_maxage ASC", [id]);
    res.json(listOfCategories.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function read_event_categories_public(req, res) {
  try {
    const { id } = req.params;
    const verifyUser = await pool.query("SELECT user_birth_date, user_gender FROM users WHERE user_id = $1", [req.userId]);
    const userInfo = verifyUser.rows[0];
    const userAge = new Date().getFullYear() - userInfo.user_birth_date.getFullYear(); // Milliseconds to Years
    const listOfCategories = await pool.query(
      "SELECT * FROM event_categories WHERE (event_id = $1) AND (category_minage <= $2) AND (category_maxage >= $2) AND (category_gender = $3 OR category_gender = 'unisex') ORDER BY category_maxage ASC",
      [id, userAge, userInfo.user_gender]
    );
    if (!listOfCategories.rows[0]) {
      res.json({ message: "Esse evento não tem nenhuma categoria disponível para você.", type: "error" });
    }
    res.json(listOfCategories.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function update_categories(req, res) {}

async function delete_categories(req, res) {
  try {
    const { id, targetCategoryId } = req.params;
    const moveRegistrations = await pool.query("UPDATE registrations SET category_id = $1 WHERE category_id = $2", [targetCategoryId, id]);
    const removeCategory = await pool.query("DELETE FROM event_categories WHERE category_id = $1", [id]);
    res.status(200).json({ message: "Categoria Removida.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: `Erro ao remover categoria. ${err.message}`, type: "error" });
  }
}

module.exports = { create_category, read_event_categories_admin, read_event_categories_public, update_categories, delete_categories };
