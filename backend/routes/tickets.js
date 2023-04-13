const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const ticketController = require("../controllers/ticketController");
const reCaptcha = require("../middlewares/reCaptcha");

router.get("/", adminAuthorization, ticketController.list_tickets);

router.get("/:id", adminAuthorization, ticketController.fetch_ticket);

router.post(
  "/admin/:id/",
  adminAuthorization,
  ticketController.answer_ticket_admin
);

router.post("/", reCaptcha, ticketController.create_ticket);

module.exports = router;
