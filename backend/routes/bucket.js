const router = require("express").Router();
const adminAuthorization = require("../middlewares/adminAuthorization");
const bucketController = require("../controllers/bucketController");

const multer = require("multer");
var upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 },
});

// Create Document
router.post("/", [adminAuthorization(), upload.single("file")], bucketController.upload_file);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    res.json({ error: "File size limit exceeded" });
  } else {
    next(err);
  }
});

module.exports = router;
