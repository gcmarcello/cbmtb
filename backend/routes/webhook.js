const router = require("express").Router();
const pool = require("../database/database");
const { updateRegistrationStatus } = require("../services/registrations");
const Email = require("../utils/emails");

router.post("/pagarme", async (req, res) => {
  try {
    if (!req.body?.data) return res.status(400).json("Invalid request");
    const { type } = req.body;
    const { id, status } = req.body.data;
    const metadata = req.body?.data?.metadata;

    if (status === "paid" && type === "order.paid") {
      await updateRegistrationStatus(metadata.registrationId, "completed");
    }

    try {
      if (process.env.PAGARME_EMAIL) {
        const sgEmail = new Email([process.env.PAGARME_EMAIL]);
        await sgEmail.sendOrderEmail(req.body.data, status);
      }
    } catch (error) {
      console.log("Erro ao enviar email");
    }

    return res.status(200).json("ok");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

module.exports = router;
