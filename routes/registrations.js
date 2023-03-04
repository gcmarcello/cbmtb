const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const pool = require("../database");
const authorization = require("./middlewares/authorization");
const adminAuthorization = require("./middlewares/adminAuthorization");

const fetch = require("node-fetch");

// Read User Registrations (USER)
router.get("/user/", authorization, async (req, res) => {
  try {
    const userId = req.userId;
    const registrations = await pool.query(
      "SELECT r.registration_status, r.registration_shirt, r.registration_id, r.payment_id, c.category_name, e.event_id, e.event_name, e.event_description, e.event_rules, e.event_location, e.event_date, e.event_price, e.event_image FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN categories AS c ON r.category_id = c.category_id LEFT JOIN events AS e ON c.event_id = e.event_id WHERE u.user_id = $1",
      [userId]
    );

    res.status(200).json(registrations.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// Create Registrations (USER)
router.post("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { categoryId, registrationShirt } = req.body;
    const checkForRegistration = await pool.query("SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2", [id, userId]);
    let paymentInfo;

    if (checkForRegistration.rows[0]) {
      res.status(200).json({ message: "Você já se inscreveu neste evento!", type: "error" });
      return;
    }

    const txid = crypto.randomUUID().replace(/-/g, "");
    const eventCost = await pool.query("SELECT event_price FROM events WHERE event_id = $1", [id]);

    const paymentStatus = eventCost.rows[0].event_price > 0 ? "pending" : "completed";

    const newPayment = await pool.query(
      `INSERT INTO payments (payment_txid, payment_value, user_id, event_id, payment_status) VALUES ($1,$2,$3,$4,$5) RETURNING payment_id`,
      [txid, eventCost.rows[0].event_price, userId, id, paymentStatus]
    );

    const newRegistrations = await pool.query(
      `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt, payment_id, registration_status, registration_date) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, userId, categoryId, registrationShirt, newPayment.rows[0].payment_id, paymentStatus, new Date()]
    );

    axios({
      method: "GET",
      headers: {
        token: `${req.header("token")}`,
        "Content-Type": "application/json",
      },
      url: `http://localhost:3000/api/payments/pix/${newPayment.rows[0].payment_id}`,
    }).then((response) =>
      res.status(200).json({
        message: "Inscrição realizada com sucesso.",
        type: "success",
        paymentId: eventCost.rows[0].event_price > 0 ? newPayment.rows[0].payment_id : 0,
      })
    );
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

// Read Event Registrations (ADMIN)
router.get("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await pool.query(
      "SELECT u.user_first_name, u.user_last_name, u.user_cpf, u.user_gender, u.user_phone, u.user_birth_date, r.registration_status, r.registration_shirt, c.category_name FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN categories AS c ON r.category_id = c.category_id WHERE r.event_id = $1",
      [id]
    );
    res.status(200).json(registrations.rows);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
