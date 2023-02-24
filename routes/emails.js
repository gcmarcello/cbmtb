const router = require("express").Router();
const adminAuthorization = require("./middlewares/adminAuthorization");
const { listVerifiedEmails } = require("../apis/awsSES");

// List Verified Emails
router.get("/", adminAuthorization, async (req, res) => {
  try {
    const list = await listVerifiedEmails();
    return res.json(list);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
