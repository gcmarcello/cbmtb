const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const documentsController = require("../controllers/documentsController");

const multer = require("multer");
var upload = multer({ dest: "uploads/" });

// Read Document
router.get("/:id", documentsController.read_document);

// List Documents
router.get("/", documentsController.list_documents);

// Create Document
router.post("/", [adminAuthorization, upload.single("file")], documentsController.create_document);

// Delete Document
router.delete("/:id", adminAuthorization, documentsController.delete_document);

module.exports = router;
