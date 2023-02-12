const router = require("express").Router();
const pool = require("../database");
const authorization = require("./middlewares/authorization");
const adminAuthorization = require("./middlewares/adminAuthorization");

// Create Registrations (USER)
router.post("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { categoryId, registrationShirt } = req.body;
    const checkForRegistration = await pool.query("SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2", [id, userId]);

    if (checkForRegistration.rows[0]) {
      res.status(200).json({ message: "Você já se inscreveu neste evento.", type: "error" });
      return;
    }

    const newRegistrations = await pool.query(
      `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt,registration_status) VALUES ($1,$2,$3,$4,$5)`,
      [id, userId, categoryId, registrationShirt, "pending"]
    );

    res.status(200).json({ message: "Inscrição realizada com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
});

// Read Registrations (USER)
router.get("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await pool.query(
      "SELECT u.user_given_name, u.user_last_name, u.user_cpf, u.user_gender, u.user_phone, u.user_birth_date, r.registration_status, c.category_name FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN categories AS c ON r.category_id = c.category_id WHERE r.event_id = $1",
      [id]
    );
    res.status(200).json(registrations.rows);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
