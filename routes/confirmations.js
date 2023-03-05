const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");
const jwtGenerator = require("../utils/jwtGenerator");
const emails = require("../utils/emails");

// Confirm Email
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkConfirmation = await pool.query("SELECT * FROM email_confirmations WHERE confirmation_id = $1", [id]);
    if (!checkConfirmation.rows[0]) {
      return res.status(400).json({ message: "Erro ao confirmar sua conta. Por favor verifique o link.", type: "error" });
    }

    const confirmAccount = await pool.query("UPDATE users SET user_confirmed = $1 WHERE user_id = $2 RETURNING *", [
      true,
      checkConfirmation.rows[0].user_id,
    ]);
    const removeConfirmation = await pool.query("DELETE FROM email_confirmations WHERE confirmation_id = $1", [
      checkConfirmation.rows[0].confirmation_id,
    ]);

    const token = jwtGenerator(confirmAccount.rows[0].user_id, confirmAccount.rows[0].user_role, confirmAccount.rows[0].user_first_name);
    return res.status(200).json({
      token: token,
      role: confirmAccount.rows[0].user_role,
      name: confirmAccount.rows[0].user_name,
      givenName: confirmAccount.rows[0].user_first_name,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Erro ao confirmar conta.", type: "error" });
  }
});

module.exports = router;
