const router = require("express").Router();

const authorization = require("../middlewares/authorization");
const adminAuthorization = require("../middlewares/authorization");
const categoryController = require("../controllers/categoriesController");

// Create Categories (ADMIN)
router.post("/:id", adminAuthorization, categoryController.create_category);
// Read Event Categories (ADMIN)
router.get("/:id", adminAuthorization, categoryController.read_event_categories_admin);
// Read Event Categories (PUBLIC)
router.get("/:id/public", authorization, categoryController.read_event_categories_public);
// Update Categories (ADMIN)
router.put("/:id", adminAuthorization, categoryController.update_categories);
// Delete Category
router.delete("/:id", adminAuthorization, categoryController.delete_categories);

module.exports = router;
