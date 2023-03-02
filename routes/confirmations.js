const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");

// Confirm Email
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkConfirmation = await pool.query("SELECT * FROM email_confirmations WHERE confirmation_id = $1", [id]);
    if (!checkConfirmation.rows[0]) {
      return res.status(400).json({ message: "Erro ao confirmar sua conta. Por favor verifique o link.", type: "error" });
    } else if (checkConfirmation.rows[0].confirmation_status) {
      return res.status(400).json({ message: "Conta já confirmada.", type: "error" });
    }
    const confirmAccount = await pool.query("UPDATE users SET user_confirmed = $1 WHERE user_id = $2", [true, checkConfirmation.rows[0].user_id]);
    const removeConfirmation = await pool.query("DELETE FROM email_confirmations WHERE confirmation_id = $1", [
      checkConfirmation.rows[0].confirmation_id,
    ]);
    return res.status(200).json({ message: "Conta confirmada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
