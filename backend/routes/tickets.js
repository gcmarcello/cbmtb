const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const ticketController = require("../controllers/ticketController");
const reCaptcha = require("../middlewares/reCaptcha");
const pool = require("../database/database");
const dayjs = require("dayjs");

router.get("/", adminAuthorization(), ticketController.list_tickets);

router.get("/:id", ticketController.fetch_ticket);

router.post("/admin/:id/", adminAuthorization(), ticketController.answer_ticket_admin);

router.post("/public/:id/", reCaptcha, ticketController.answer_ticket_public);

router.put("/:id/", adminAuthorization(), ticketController.resolve_ticket);

router.post("/", reCaptcha, ticketController.create_ticket);

module.exports = router;
