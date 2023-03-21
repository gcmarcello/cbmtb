const router = require("express").Router();

const adminAuthorization = require("../middlewares/authorization");

const documentsController = require("../controllers/documentsController");

// Read Document
router.get("/:id", documentsController.read_document);

// List Documents
router.get("/", documentsController.list_documents);

// Create Document
router.post("/", adminAuthorization, documentsController.create_document);

// Delete Document
router.delete("/:id", adminAuthorization, documentsController.delete_document);

module.exports = router;
