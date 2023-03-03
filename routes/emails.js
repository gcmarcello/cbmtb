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

router.post("/recovery/:id", adminAuthorization, async (req, res) => {
  try {
    const list = await listVerifiedEmails();
    return res.json(list);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/bounces/", async (req, res) => {
  try {
    console.log(req.body.message);
    return res.json(req);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
