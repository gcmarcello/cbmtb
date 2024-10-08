const router = require("express").Router();

const adminAuthorization = require("../middlewares/adminAuthorization");
const newsController = require("../controllers/newsController");

const multer = require("multer");
var upload = multer({ dest: "uploads/" });

// Create News (ADMIN)
router.post("/", [adminAuthorization(["press"]), upload.single("image")], newsController.create_news);

// List News (ADMIN)
router.get("/", adminAuthorization(["press"]), newsController.list_news_admin);

// List All News (PUBLIC)
router.get("/public/all", newsController.list_all_news_public);

// List News (PUBLIC)
router.get("/public/:category?", newsController.list_news_public);

// List Categories
router.get("/categories", adminAuthorization(["press"]), newsController.list_categories);

// Publish/Unpublish News (ADMIN)
router.put("/toggle/:id/:boolean", adminAuthorization(["press"]), newsController.publish_unpublish_news);

// Fetch Specific News (PUBLIC)
router.get("/:id", newsController.fetch_specific_news);

// Update News (ADMIN)
router.put("/:id", [adminAuthorization(["press"]), upload.single("image")], newsController.update_news);

// Delete News
router.delete("/:id", adminAuthorization(["press"]), newsController.delete_news);

module.exports = router;
