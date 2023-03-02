const router = require("express").Router();
const pool = require("../database");
const bcrypt = require("bcrypt");
const registrationValidation = require("./middlewares/registrationValidation");
const authorization = require("./middlewares/authorization");
const jwtGenerator = require("../utils/jwtGenerator");
const reCaptcha = require("./middlewares/reCaptcha");

// Register Route
router.post("/register", [reCaptcha, registrationValidation], async (req, res) => {
  const { address, apartment, birthDate, cep, city, cpf, email, firstName, gender, lastName, number, password, phone, state } = req.body;
  try {
    // Encrypting password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Inserting user into DB
    const newUser = await pool.query(
      "INSERT INTO users (user_email, user_password, user_first_name, user_last_name, user_cpf, user_gender, user_phone, user_birth_date, user_cep, user_state, user_city, user_address, user_number, user_apartment, user_role, user_confirmed) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
      [email, bcryptPassword, firstName, lastName, cpf, gender, phone, birthDate, cep, state, city, address, number, apartment, "user", false]
    );

    const newConfirmation = await pool.query("INSERT INTO email_confirmations (register_date,user_id,confirmation_status) VALUES ($1,$2,$3)", [
      new Date(),
      newUser.rows[0].user_id,
      false,
    ]);

    res.status(200).json({ message: "Cadastro efetuado com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Erro realizar o cadastro. por favor atualize a página e tente novamente.", type: "error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { cpf, password } = req.body;
  const CPFVerification = await pool.query("SELECT * FROM users WHERE user_cpf = $1", [cpf]);

  if (!CPFVerification.rows[0]) {
    return res.status(400).json({ message: "CPF ou senha estão incorretos.", type: "error" });
  } else if (!CPFVerification.rows[0].user_confirmed) {
    return res.status(400).json({ message: "Esta conta ainda não foi confirmada.", type: "error" });
  }

  if (await bcrypt.compare(password, CPFVerification.rows[0].user_password)) {
    try {
      const token = jwtGenerator(CPFVerification.rows[0].user_id, CPFVerification.rows[0].user_role, CPFVerification.rows[0].user_first_name);
      res.json({
        token: token,
        role: CPFVerification.rows[0].user_role,
        name: CPFVerification.rows[0].user_name,
        givenName: CPFVerification.rows[0].user_first_name,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json("Server Error");
    }
  } else {
    return res.json("Usuário ou senha estão incorretos.");
  }
});

router.get("/self", authorization, async (req, res) => {
  try {
    const self = await pool.query(
      "SELECT user_email, user_first_name, user_last_name, user_gender, user_phone, user_cpf, user_birth_date, user_cep, user_state, user_city, user_address, user_number, user_apartment FROM users WHERE user_id = $1",
      [req.userId]
    );
    res.status(200).json(self.rows[0]);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// Authentication Route
router.get("/authentication", authorization, async (req, res) => {
  try {
    res.json({ authentication: true, role: req.userRole, name: req.userName, givenName: req.userGivenName });
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
