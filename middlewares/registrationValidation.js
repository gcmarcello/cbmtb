const pool = require("../database/database");
module.exports = async (req, res, next) => {
  const { cpf, email, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  function validPassword(userPassword) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%#*?&]{8,}$/.test(userPassword);
  }

  if (req.path === "/register") {
    const checkExistingCPF = await pool.query(
      "SELECT * FROM users WHERE user_cpf = $1",
      [cpf]
    );
    const checkExistingEmail = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );
    if (!validEmail(email)) {
      return res
        .status(400)
        .json({ message: "Email inválido.", type: "error", field: "email" });
    } else if (!validPassword(password)) {
      return res
        .status(400)
        .json({ message: "Senha inválida.", type: "error", field: "password" });
    } else if (checkExistingEmail.rows[0]) {
      return res
        .status(400)
        .json({
          message: "Este email já pertence a outra conta.",
          type: "error",
          field: "email",
        });
    } else if (checkExistingCPF.rows[0]) {
      return res
        .status(400)
        .json({
          message: "Este CPF já pertence a outra conta.",
          type: "error",
          field: "cpf",
        });
    }
  }

  if (req.path === "/login") {
    if (!password) {
      return res.status(400).json("Senha ou usuário estão vazios.");
    }
  }

  next();
};
