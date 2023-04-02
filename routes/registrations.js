const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const pool = require("../database");
const authorization = require("../middlewares/authorization");
const adminAuthorization = require("../middlewares/authorization");

const Email = require("../utils/emails");

const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Read User Registrations (USER)
router.get("/user/", authorization, async (req, res) => {
  try {
    const userId = req.userId;
    const registrations = await pool.query(
      "SELECT r.registration_status, r.registration_shirt, r.registration_id, r.payment_id, c.category_name, e.event_id, e.event_name, e.event_description, e.event_rules, e.event_location, e.event_date_start, e.event_image FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN event_categories AS c ON r.category_id = c.category_id LEFT JOIN events AS e ON c.event_id = e.event_id WHERE u.user_id = $1",
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

    const eventCost = await pool.query("SELECT category_price FROM event_categories WHERE category_id = $1", [categoryId]);
    const paymentStatus = eventCost.rows[0].category_price > 0 ? "pending" : "completed";

    if (eventCost.rows[0].category_price) {
      const txid = crypto.randomUUID().replace(/-/g, "");

      const newPayment = await pool.query(
        `INSERT INTO payments (payment_txid, payment_value, user_id, event_id, payment_status) VALUES ($1,$2,$3,$4,$5) RETURNING payment_id`,
        [txid, eventCost.rows[0].category_price, userId, id, paymentStatus]
      );
    }

    const newRegistrations = await pool.query(
      `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt, payment_id, registration_status, registration_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING registration_id`,
      [id, userId, categoryId, registrationShirt, eventCost.rows[0].category_price ? newPayment?.rows[0].payment_id : null, paymentStatus, new Date()]
    );

    if (paymentStatus === "completed") {
      const userInfo = await pool.query("SELECT user_email, user_first_name FROM users WHERE user_id = $1", [userId]);
      const eventInfo = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);
      const categoryInfo = await pool.query("SELECT * FROM event_categories WHERE category_id = $1", [categoryId]);
      const sgEmail = new Email([userInfo.rows[0].user_email]);
      sgEmail.sendRegistrationEmail(
        userInfo.rows[0].user_first_name,
        eventInfo.rows[0].event_name,
        eventInfo.rows[0].event_date_start,
        eventInfo.rows[0].event_date_end,
        eventInfo.rows[0].event_location,
        categoryInfo.rows[0].category_name,
        newRegistrations.rows[0].registration_id,
        eventInfo.rows[0].event_link
      );
    }

    res.status(200).json({
      message: "Inscrição realizada com sucesso.",
      type: "success",
    });

    /* axios({
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
    ); */
  } catch (err) {
    console.log(err.message);
  }
});

// Delete Registrations (USER)
router.delete("/:eventId/:registrationId", authorization, async (req, res) => {
  try {
    const { eventId, registrationId } = req.params;
    const userId = req.userId;

    const deleteRegistration = await pool.query("DELETE FROM registrations WHERE registration_id = $1 AND user_id = $2 RETURNING *", [
      registrationId,
      userId,
    ]);
    const userInfo = (await pool.query("SELECT user_first_name, user_email FROM users WHERE user_id = $1", [userId])).rows[0];
    const eventInfo = (await pool.query("SELECT event_name, event_link FROM events WHERE event_id = $1", [eventId])).rows[0];

    const sgEmail = new Email([userInfo.user_email]);
    sgEmail.sendRegistrationCancellationEmail(userInfo.user_first_name, eventInfo.event_name, eventInfo.event_link);

    res.status(200).json({
      message: "Inscrição cancelada com sucesso.",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao cancelar a inscrição. ${err.message}`,
      type: "error",
    });
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
    const checkForAvailability = await pool.query(
      "SELECT event_registrations_start, event_registrations_end, event_status, event_current_attendees, event_max_attendees FROM events WHERE event_id = $1",
      [id]
    );
    const checkForUser = await pool.query("SELECT * from users WHERE user_id = $1", [userId]);
    const userAge = dayjs().diff(checkForUser.rows[0].user_birth_date, "years");

    const registrationStarts = dayjs(checkForAvailability.rows[0].event_registrations_start);
    const registrationEnds = dayjs(checkForAvailability.rows[0].event_registrations_end);
    const currentAttendees = checkForAvailability.rows[0].event_current_attendees;
    const maxAttendees = checkForAvailability.rows[0].event_max_attendees;
    const periodVerification = dayjs().isBetween(registrationStarts, registrationEnds, null, []);

    const listOfCategories = await pool.query(
      "SELECT * FROM event_categories WHERE (event_id = $1) AND (category_minage <= $2) AND (category_maxage >= $2) AND (category_gender = $3 OR category_gender = 'unisex') ORDER BY category_maxage ASC",
      [id, userAge, checkForUser.rows[0].user_gender]
    );
    if (!listOfCategories.rows[0]) {
      return res.status(200).json({ message: "Esse evento não tem nenhuma categoria disponível para você.", type: "error" });
    }

    // Checking if user is already registered
    if (checkForRegistration.rows[0]) {
      return res.status(200).json({ message: "Inscrito!", type: "error" });
    }

    // Checking for manual registration status
    if (!checkForAvailability.rows[0].event_status) {
      return res.status(200).json({ message: "Inscrições Indisponíveis", type: "error" });
    }

    // Checking for number of registrations
    if (currentAttendees >= maxAttendees) {
      return res.status(200).json({ message: "Inscrições Esgotadas", type: "error" });
    }

    // Checking for registration period
    if (!periodVerification) {
      return res.status(200).json({ message: "Inscrições Encerradas", type: "error" });
    }

    return res.status(200).json({ message: "Inscrições Disponíveis", type: "success", data: listOfCategories.rows });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
