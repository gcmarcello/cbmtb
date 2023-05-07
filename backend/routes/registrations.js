const router = require("express").Router();

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const adminAuthorization = require("../middlewares/adminAuthorization");
const registrationAvailability = require("../middlewares/registrationAvailability");
const updateUser = require("../middlewares/updateUser");

const registrationsController = require("../controllers/registrationsController");

// Delete Registrations (ADMIN)
router.delete("/admin/:eventId/:registrationId", adminAuthorization, registrationsController.delete_registration_admin);

// Verify Registration QRCode (USER)
router.get("/verify/:eventId/:id", registrationsController.verify_registration);

// Verify Registration QRCode (USER)
router.post("/checkin/:id", authorization, registrationsController.checkin_registration);

// Read User Registrations (USER)
router.get("/user/", authorization, registrationsController.read_user_registrations);

// Update Registration
router.put("/", adminAuthorization, registrationsController.update_registration);

// Create Registrations (USER)
router.post("/:id/:coupon?", [authorization, registrationAvailability, updateUser], registrationsController.create_registration);

// Delete Registrations (USER)
router.delete("/:eventId/:registrationId", authorization, registrationsController.delete_registration);

// Check if user is registered (USER)
router.get("/:id/checkreg/:coupon?", authentication, registrationsController.check_registration);

// List Registrations
router.get("/:id/:type?", adminAuthorization, registrationsController.list_event_registrations);

module.exports = router;
