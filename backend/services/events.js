const pool = require("../database/database");
const { isValidUUID } = require("../utils/parser");

async function readEventFromId(id) {
  const event = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);

  return event.rows[0] ?? null;
}

async function readEventAttendeesList(id) {
  const isUuid = isValidUUID(id);
  let event = null;

  if (isUuid) {
    event = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);
  } else {
    event = await pool.query("SELECT * FROM events WHERE event_link = $1", [id]);
  }

  if (!event.rows[0]) throw "Event not found.";

  if (!event.rows[0].showattendees)
    throw "Attendees list is not available for this event.";

  const attendees = await pool.query(
    "SELECT registrations.*, users.user_first_name, users.user_last_name, event_categories.category_name FROM registrations JOIN users ON registrations.user_id = users.user_id JOIN event_categories ON registrations.category_id = event_categories.category_id WHERE registrations.event_id = $1",
    [event.rows[0].event_id]
  );

  return { attendees: attendees.rows, event: event.rows[0] };
}

module.exports = { readEventFromId, readEventAttendeesList };
