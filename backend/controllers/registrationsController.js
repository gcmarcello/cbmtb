const axios = require("axios");
const crypto = require("crypto");
const pool = require("../database/database");
const Email = require("../utils/emails");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

async function create_registration(req, res) {
  try {
    const { id, userId } = req;
    const { category, registrationShirt } = req.body;
    const checkForRegistration = await pool.query("SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2", [id, userId]);

    if (checkForRegistration.rows[0]) {
      res.status(200).json({ message: "Você já se inscreveu neste evento!", type: "error" });
      return;
    }

    const eventCost = await pool.query("SELECT category_price FROM event_categories WHERE category_id = $1", [category]);
    const paymentStatus = eventCost.rows[0].category_price > 0 ? "pending" : "completed";

    if (eventCost.rows[0].category_price) {
      const txid = crypto.randomUUID().replace(/-/g, "");

      const newPayment = await pool.query(
        `INSERT INTO payments (payment_txid, payment_value, user_id, event_id, payment_status) VALUES ($1,$2,$3,$4,$5) RETURNING payment_id`,
        [txid, eventCost.rows[0].category_price, userId, id, paymentStatus]
      );
    }

    const newRegistrations = await pool.query(
      `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt, payment_id, registration_status, registration_date, coupon_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING registration_id`,
      [
        id,
        userId,
        category,
        registrationShirt,
        eventCost.rows[0].category_price ? newPayment?.rows[0].payment_id : null,
        paymentStatus,
        new Date(),
        req.couponId || null,
      ]
    );

    if (paymentStatus === "completed") {
      const userInfo = await pool.query("SELECT user_email, user_first_name FROM users WHERE user_id = $1", [userId]);
      const eventInfo = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);
      const categoryInfo = await pool.query("SELECT * FROM event_categories WHERE category_id = $1", [category]);
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
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Erro ao finalizar inscrição.",
      type: "error",
    });
  }
}

async function read_user_registrations(req, res) {
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
}

async function update_registration(req, res) {
  try {
    const { registrationShirt, registrationCategory, registrationId } = req.body;

    const updateRegistration = await pool.query(
      "UPDATE registrations SET registration_shirt = $1, category_id = $2 WHERE registration_id = $3 RETURNING *",
      [registrationShirt, registrationCategory, registrationId]
    );

    res.status(200).json({
      message: "Inscrição atualizada com sucesso!",
      type: "success",
      data: updateRegistration.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao alterar inscrição. ${err.message}`,
      type: "success",
    });
  }
}

async function delete_registration(req, res) {
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
}

async function delete_registration_admin(req, res) {
  try {
    const { eventId, registrationId } = req.params;

    const deleteRegistration = await pool.query("DELETE FROM registrations WHERE registration_id = $1 RETURNING *", [registrationId]);

    const userInfo = (await pool.query("SELECT user_first_name, user_email FROM users WHERE user_id = $1", [deleteRegistration.rows[0].user_id]))
      .rows[0];
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
}

async function check_registration(req, res) {
  try {
    let { id, coupon } = req.params;
    const userId = req.userId;
    const typeOfLink = /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(id);

    if (!typeOfLink) {
      const response = await pool.query("SELECT event_id FROM events WHERE event_link = $1", [id]);
      if (response.rows[0]) {
        id = await response.rows[0].event_id;
      } else {
        return res.status(404).json({ message: "Evento não existe", type: "error" });
      }
    }

    const checkForAvailability = await pool.query(
      "SELECT event_registrations_start, event_registrations_end, event_status, event_general_attendees FROM events WHERE event_id = $1",
      [id]
    );

    let checkForRegistration;
    let checkForUser;
    let userAge;

    if (req.userId) {
      checkForRegistration = await pool.query("SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2", [id, userId]);
      checkForUser = await pool.query("SELECT * from users WHERE user_id = $1", [userId]);
      userAge = dayjs().diff(checkForUser.rows[0].user_birth_date, "years");

      // Checking if user is already registered
      if (checkForRegistration.rows[0]) {
        return res.status(200).json({ message: "Inscrito!", type: "error" });
      }
      const listOfCategories = await pool.query(
        "SELECT * FROM event_categories WHERE (event_id = $1) AND (category_minage <= $2) AND (category_maxage >= $2) AND (category_gender = $3 OR category_gender = 'unisex') ORDER BY category_maxage ASC",
        [id, userAge, checkForUser.rows[0].user_gender]
      );

      if (!listOfCategories.rows[0]) {
        return res.status(200).json({
          message: "Esse evento não tem nenhuma categoria disponível para você.",
          type: "error",
        });
      }

      if (coupon) {
        const validateCoupon = await pool.query("SELECT * FROM event_coupons WHERE event_id = $1 AND coupon_link = $2", [id, coupon]);
        if (!validateCoupon.rows[0]) {
          return res.status(200).json({ message: "Página não encontrada.", type: "error" });
        }
        const verifyAvailability = await pool.query(
          "SELECT * FROM registrations AS r LEFT JOIN event_coupons AS ec ON r.coupon_id = ec.coupon_id WHERE r.event_id = $1 AND ec.coupon_link = $2",
          [id, coupon]
        );
        if (verifyAvailability.rows.length >= validateCoupon.rows[0].coupon_uses) {
          return res.status(200).json({ message: "Cupom Esgotado.", type: "error" });
        }
        return res.status(200).json({
          message: "Cupom Disponível!",
          type: "success",
        });
      }
    }

    const registrationStarts = dayjs(checkForAvailability.rows[0].event_registrations_start);
    const registrationEnds = dayjs(checkForAvailability.rows[0].event_registrations_end);
    const maxAttendees = checkForAvailability.rows[0].event_general_attendees;
    const currentAttendees = (
      await pool.query("SELECT event_id, COUNT(*) as num_attendees FROM registrations WHERE coupon_id IS NULL GROUP BY event_id")
    ).rows[0].num_attendees;
    console.log(maxAttendees - currentAttendees);
    const periodVerification = dayjs().isBetween(registrationStarts, registrationEnds, null, []);

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

    return res.status(200).json({
      message: "Inscrições Disponíveis!",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  create_registration,
  read_user_registrations,
  update_registration,
  delete_registration,
  delete_registration_admin,
  check_registration,
};
