const pool = require("../../database");

module.exports = async (req, res, next) => {
  const { username, email, password } = req.body;

  function validName(userName) {
    return /^[a-zA-Z0-9_-]{3,16}$/.test(userName);
  }

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  function validPassword(userPassword) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%#*?&]{8,}$/.test(userPassword);
  }

  if (req.path === "/register") {
    const checkExistingUser = await pool.query("SELECT * FROM users WHERE user_name = $1", [username]);
    const checkExistingEmail = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
    if (!validName(username)) {
      return res.status(400).json({ message: "Usuário inválido.", type: "username" });
    } else if (!validEmail(email)) {
      return res.status(400).json({ message: "Email inválido.", type: "email" });
    } else if (!validPassword(password)) {
      return res.status(400).json({ message: "Senha inválida.", type: "password" });
    } else if (checkExistingEmail.rows[0]) {
      return res.status(400).json({ message: "Este email já pertence a outra conta.", type: "email" });
    } else if (checkExistingUser.rows[0]) {
      return res.status(400).json({ message: "Este usuário já pertence a outra conta.", type: "username" });
    }
  }

  if (req.path === "/login") {
    if (![username, password].every(Boolean)) {
      return res.status(400).json("Senha ou usuário estão vazios.");
    }
  }

  if (req.path === "/password/reset/*") {
    if (![username, password].every(Boolean)) {
      return res.status(400).json("Senha ou usuário estão vazios.");
    } else if (!validPassword(password)) {
      return res.status(400).json("Senha inválida.");
    }
  }

  next();
};
