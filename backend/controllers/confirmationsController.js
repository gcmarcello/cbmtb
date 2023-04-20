const pool = require("../database/database");
const Email = require("../utils/emails");
const jwtGenerator = require("../utils/jwtGenerator");

async function confirm_account(req, res) {
  try {
    const { id } = req.params;
    const checkConfirmation = await pool.query("SELECT * FROM email_confirmations WHERE confirmation_id = $1", [id]);
    if (!checkConfirmation.rows[0]) {
      return res.status(400).json({
        message: "Erro ao confirmar sua conta. Por favor verifique o link.",
        type: "error",
      });
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
}

async function resend_confirmation(req, res) {
  try {
    const { userId } = req.params;
    const checkConfirmation = await pool.query(
      "SELECT confirmation_id, user_email, user_first_name FROM email_confirmations AS ec LEFT JOIN users AS u ON ec.user_id = u.user_id WHERE ec.user_id = $1",
      [userId]
    );
    if (!checkConfirmation.rows[0]) {
      return res.status(400).json({
        message: "Erro ao encontrar conta.",
        type: "error",
      });
    }

    const sgEmail = new Email([checkConfirmation.rows[0].user_email]);
    sgEmail.sendConfirmationEmail(checkConfirmation.rows[0].user_first_name, checkConfirmation.rows[0].confirmation_id);

    return res.status(200).json({ message: "Confirmação reenviada.", type: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Erro ao reenviar confirmação.", type: "error" });
  }
}

module.exports = { confirm_account, resend_confirmation };
