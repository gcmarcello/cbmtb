const router = require("express").Router();
const path = require("path");
const authorization = require("../middlewares/authorization");
require("dotenv").config();
const paymentsController = require("../controllers/paymentsController");

router.post("/", authorization, paymentsController.createOrder);

router.get("/:id", authorization, paymentsController.verifyPayment);

module.exports = router;
