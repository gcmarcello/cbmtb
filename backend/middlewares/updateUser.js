const pool = require("../database/database");

module.exports = async (req, res, next) => {
  const userId = req.userId;
  const { address, apartment, cep, city, email, firstName, lastName, number, password, phone, state } = req.body;
  const userInfo = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  try {
    /*     if (!(await bcrypt.compare(password, userInfo.rows[0].user_password))) {
      return res.status(403).json({ message: "Senha incorreta.", type: "error" });
    } */
    const userInfoUpdate = await pool.query(
      "UPDATE users SET user_address = $1, user_apartment = $2, user_cep = $3, user_city = $4, user_email = $5, user_first_name = $6, user_last_name = $7, user_number = $8, user_phone = $9, user_state = $10 WHERE user_id = $11",
      [address, apartment, cep, city, email.toLowerCase(), firstName, lastName, number, phone, state, userId]
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: `Erro ao atualizar suas informações. ${err.message}`,
      type: "error",
    });
  }
  next();
};
