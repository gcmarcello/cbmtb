const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const ticketController = require("../controllers/ticketController");

router.get("/", adminAuthorization, ticketController.list_tickets);

router.get("/:id", adminAuthorization, ticketController.fetch_ticket);

router.put("/:id", adminAuthorization, ticketController.answer_ticket);

module.exports = router;
