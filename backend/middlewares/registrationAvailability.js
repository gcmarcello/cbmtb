const pool = require("../database/database");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

module.exports = async (req, res, next) => {
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
    return res.status(200).json({
      message: "Esse evento não tem nenhuma categoria disponível para você.",
      type: "error",
    });
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
    console.log("ACABOU");
    return res.status(200).json({ message: "Inscrições Esgotadas", type: "error" });
  }

  // Checking for registration period
  if (!periodVerification) {
    return res.status(200).json({ message: "Inscrições Encerradas", type: "error" });
  }

  next();
};
