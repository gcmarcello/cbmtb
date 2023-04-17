const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const pool = require("../database/database");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const adminAuthorization = require("../middlewares/adminAuthorization");

const registrationsController = require("../controllers/registrationsController");

const Email = require("../utils/emails");

const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const registrationAvailability = require("../middlewares/registrationAvailability");
dayjs.extend(isBetween);

// Create Registrations (USER)
router.post("/:id/:coupon?", [authorization, registrationAvailability], registrationsController.create_registration);

// Read User Registrations (USER)
router.get("/user/", authorization, registrationsController.read_user_registrations);

// Update Registration
router.put("/", adminAuthorization, registrationsController.update_registration);

// Delete Registrations (USER)
router.delete("/:eventId/:registrationId", authorization, registrationsController.delete_registration);

// Delete Registrations (ADMIN)
router.delete("/admin/:eventId/:registrationId", adminAuthorization, registrationsController.delete_registration_admin);

// Check if user is registered (USER)
router.get("/:id/checkreg/:coupon?", authentication, registrationsController.check_registration);

module.exports = router;
