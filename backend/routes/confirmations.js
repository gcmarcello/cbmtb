const router = require("express").Router();

const adminAuthorization = require("../middlewares/adminAuthorization");

const confirmationsController = require("../controllers/confirmationsController");

// Confirm Email
router.get("/:id", confirmationsController.confirm_account);

// Confirm Email
router.post("/:userId", adminAuthorization, confirmationsController.resend_confirmation);

module.exports = router;
