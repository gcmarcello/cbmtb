const pool = require("../database/database");
const Email = require("../utils/emails");
const jwtGenerator = require("../utils/jwtGenerator");

async function confirm_account(req, res) {
  try {
    const { id } = req.params;
    const checkConfirmation = await pool.query(
      "SELECT * FROM email_confirmations WHERE confirmation_id = $1",
      [id]
    );
    if (!checkConfirmation.rows[0]) {
      return res.status(400).json({
        message: "Erro ao confirmar sua conta. Por favor verifique o link.",
        type: "error",
      });
    }

    const confirmAccount = await pool.query(
      "UPDATE users SET user_confirmed = $1 WHERE user_id = $2 RETURNING *",
      [true, checkConfirmation.rows[0].user_id]
    );
    const removeConfirmation = await pool.query(
      "DELETE FROM email_confirmations WHERE confirmation_id = $1",
      [checkConfirmation.rows[0].confirmation_id]
    );

    const token = jwtGenerator(
      confirmAccount.rows[0].user_id,
      confirmAccount.rows[0].user_role,
      confirmAccount.rows[0].user_first_name
    );
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

    const user = (await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]))
      .rows[0];

    const newConfirmation = await pool.query(
      "INSERT INTO email_confirmations (register_date,user_id,confirmation_status) VALUES ($1,$2,$3) RETURNING *",
      [new Date(), userId, false]
    );

    const sgEmail = new Email([user.user_email]);
    await sgEmail.sendConfirmationEmail(
      user.user_first_name,
      newConfirmation.rows[0].confirmation_id
    );

    return res.status(200).json({ message: "Confirmação reenviada.", type: "success" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ message: "Erro ao reenviar confirmação.", type: "error" });
  }
}

module.exports = { confirm_account, resend_confirmation };
