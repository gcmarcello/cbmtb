const router = require("express").Router();

const federationsController = require("../controllers/federationsController");

// List Federations
router.get("/", federationsController.list_federations);

module.exports = router;
