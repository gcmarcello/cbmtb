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
      res.status(200).json({ message: "Você já se inscreveu neste evento!", type: "error" });
      return;
    }

    const newRegistrations = await pool.query(
      `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt,registration_status,registration_type) VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, userId, categoryId, registrationShirt, "pending", "normal"]
    );

    res.status(200).json({ message: "Inscrição realizada com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
});

// Check if user is registered (USER)
router.get("/:id/checkreg", authorization, async (req, res) => {
  try {
    let { id } = req.params;
    const userId = req.userId;
    const typeOfLink = /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(id);
    if (!typeOfLink) {
      const response = await pool.query("SELECT event_id FROM events WHERE event_link = $1", [id]);
      id = await response.rows[0].event_id;
    }
    const checkForRegistration = await pool.query("SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2", [id, userId]);

    if (checkForRegistration.rows[0]) {
      res.status(200).json({ message: "Você já se inscreveu neste evento!", type: "error" });
      return;
    }
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
