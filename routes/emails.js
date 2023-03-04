const router = require("express").Router();
const pool = require("../database");
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
    console.log(req.body);
    const messageObj = JSON.parse(req.body.Message);
    const notificationType = messageObj.notificationType;
    const emailDestination = messageObj.mail.destination[0];
    const bounceType = messageObj.bounce.bounceType;
    const emailSource = messageObj.mail.source;

    if (emailSource === "newsletter@cbmtb.com" && bounceType === "Permanent") {
      const deleteRecipient = await pool.query("DELETE FROM newsletter_recipients WHERE recipient_email = $1", [emailDestination]);
    }
    if (emailSource === "noreply@cbmtb.com" && bounceType === "Permanent") {
      const deleteRecipient = await pool.query("DELETE FROM users WHERE user_email = $1", [emailDestination]);
    }
    return res.json(req.body);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/complaints/", async (req, res) => {
  try {
    console.log(req.body);
    const messageObj = JSON.parse(req.body.Message);
    const notificationType = messageObj.notificationType;
    const emailDestination = messageObj.mail.destination[0];
    const bounceType = messageObj.bounce.bounceType;
    const emailSource = messageObj.mail.source;

    if (emailSource === "newsletter@cbmtb.com") {
      const deleteRecipient = await pool.query("DELETE FROM newsletter_recipients WHERE recipient_email = $1", [emailDestination]);
    }

    return res.json(req.body);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
