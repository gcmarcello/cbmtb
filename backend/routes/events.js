const router = require("express").Router();
const adminAuthorization = require("../middlewares/authorization");

const multer = require("multer");
var upload = multer({ dest: "uploads/" });

const eventsController = require("../controllers/eventsController");

// List Events (ADMIN)
router.get("/", adminAuthorization, eventsController.listEventsAdmin);
// List Events (PUBLIC)
router.get("/public/", eventsController.listEventsPublic);
// View Event (PUBLIC)
router.get("/:id", eventsController.readEventPage);
// Create Event (ADMIN)
router.post("/", [adminAuthorization, upload.single("image")], eventsController.createEvent);
// Open/Close Event (ADMIN)
router.put("/toggle/:id/:boolean", adminAuthorization, eventsController.toggleRegistrations);
// GET Info to Update Event (ADMIN)
router.get("/update/:id", adminAuthorization, eventsController.retrieveEventInformation);
// Update Event (ADMIN)
router.put("/:id", [adminAuthorization, upload.single("image")], eventsController.updateEvent);
// Delete Event (ADMIN)
router.delete("/:id", adminAuthorization, eventsController.deleteEvent);

module.exports = router;
