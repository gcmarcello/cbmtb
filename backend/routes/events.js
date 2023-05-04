const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");

const multer = require("multer");
var upload = multer({ dest: "uploads/" });

const eventsController = require("../controllers/eventsController");

// GET List Flagship Events
router.get("/flagships", eventsController.listFlagships);
// GET List Flagship Events
router.post(
  "/flagships/",
  [
    adminAuthorization,
    upload.fields([
      { name: "bg", maxCount: 1 },
      { name: "logo", maxCount: 1 },
    ]),
  ],
  eventsController.createFlagship
);
// GET List Flagship Events
router.get("/flagships/event/:id/:widget?", eventsController.listFlagshipEvents);
// GET Flagship Event Info
router.get("/flagships/:id", eventsController.fetchFlagship);
// Update Flagship (ADMIN)
router.put(
  "/flagships/:id",
  [
    adminAuthorization,
    upload.fields([
      { name: "bg", maxCount: 1 },
      { name: "logo", maxCount: 1 },
    ]),
  ],
  eventsController.updateFlagship
);
// List Events (ADMIN)
router.get("/", adminAuthorization, eventsController.listEventsAdmin);
// Create Event (ADMIN)
router.post("/", [adminAuthorization, upload.single("image")], eventsController.createEvent);
// List Next Events (PUBLIC)
router.get("/next", eventsController.listNextEvents);
// List Events (PUBLIC)
router.get("/public/:event?", eventsController.listEventsPublic);
// Open/Close Event (ADMIN)
router.put("/toggle/:id/:boolean", adminAuthorization, eventsController.toggleRegistrations);
// GET Info to Update Event (ADMIN)
router.get("/update/:id", adminAuthorization, eventsController.retrieveEventInformation);
// View Event (PUBLIC)
router.get("/:id", eventsController.readEventPage);
// View Event (PUBLIC)
router.get("/:id/medias", eventsController.listEventMedias);
// Update Event (ADMIN)
router.put("/:id", [adminAuthorization, upload.single("image")], eventsController.updateEvent);
// Delete Event (ADMIN)
router.delete("/:id", adminAuthorization, eventsController.deleteEvent);

module.exports = router;
