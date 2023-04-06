const router = require("express").Router();

const confirmationsController = require("../controllers/confirmationsController");

// Confirm Email
router.get("/:id", confirmationsController.confirm_account);

module.exports = router;
