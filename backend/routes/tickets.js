const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const ticketController = require("../controllers/ticketController");
const reCaptcha = require("../middlewares/reCaptcha");

router.get("/", adminAuthorization, ticketController.list_tickets);

router.get("/:id", ticketController.fetch_ticket);

router.post("/admin/:id/", adminAuthorization, ticketController.answer_ticket_admin);

router.post("/public/:id/", reCaptcha, ticketController.answer_ticket_public);

router.put("/:id/", adminAuthorization, ticketController.resolve_ticket);

router.get("/ouvidoriascript", adminAuthorization, async (req, res) => {
  const listTickets = (await pool.query(`SELECT * FROM tickets`)).rows;
  const ticketMessages = listTickets.map((ticket) => ({
    ticket_id: ticket.ticket_id,
    user_id: ticket.user_id,
    message_body: ticket.ticket_message,
    message_date: dayjs(ticket.ticket_date),
  }));
  const ticketMessagesSQL = ticketMessages
    .map((coupon) => `('${coupon.ticket_id}'::uuid, '${null}', '${coupon.message_body}', '${coupon.message_date}')`)
    .join(",");
  const sqlQuery = `INSERT INTO ticket_messages (ticket_id,user_id,message_body,message_date) VALUES ${ticketMessagesSQL}`;
  res.json(sqlQuery);
});

router.post("/", reCaptcha, ticketController.create_ticket);

module.exports = router;
