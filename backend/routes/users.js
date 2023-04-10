const router = require("express").Router();
const pool = require("../database/database");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

const registrationValidation = require("../middlewares/registrationValidation");
const authorization = require("../middlewares/authorization");
const adminAuthorization = require("../middlewares/adminAuthorization");
const reCaptcha = require("../middlewares/reCaptcha");

const jwtGenerator = require("../utils/jwtGenerator");
const Email = require("../utils/emails");

// Register Route
router.post("/register", [reCaptcha, registrationValidation], async (req, res) => {
  const { address, apartment, birthDate, cep, city, cpf, email, firstName, gender, lastName, number, password, phone, state } = req.body;

  if (dayjs().diff(dayjs(birthDate), "year") < 1) {
    return res.status(400).json({
      message: "Por favor, verifique a data de nascimento.",
      type: "error",
    });
  }

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

    const newConfirmation = await pool.query(
      "INSERT INTO email_confirmations (register_date,user_id,confirmation_status) VALUES ($1,$2,$3) RETURNING *",
      [new Date(), newUser.rows[0].user_id, false]
    );

    const sgEmail = new Email([email]);
    sgEmail.sendConfirmationEmail(firstName, newConfirmation.rows[0].confirmation_id);

    res.status(200).json({ message: "Cadastro efetuado com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Erro realizar o cadastro. por favor atualize a página e tente novamente.",
      type: "error",
    });
  }
});

// Update User Information
router.put("/", authorization, async (req, res) => {
  const userId = req.userId;
  const { address, apartment, cep, city, email, firstName, lastName, number, password, phone, state } = req.body;
  const userInfo = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  try {
    if (!(await bcrypt.compare(password, userInfo.rows[0].user_password))) {
      return res.status(403).json({ message: "Senha incorreta.", type: "error" });
    }
    const userInfoUpdate = await pool.query(
      "UPDATE users SET user_address = $1, user_apartment = $2, user_cep = $3, user_city = $4, user_email = $5, user_first_name = $6, user_last_name = $7, user_number = $8, user_phone = $9, user_state = $10 WHERE user_id = $11",
      [address, apartment, cep, city, email, firstName, lastName, number, phone, state, userId]
    );
    return res.status(200).json({
      message: "Informações atualizadas com sucesso!",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: `Erro ao atualizar suas informações. ${err.message}`,
      type: "error",
    });
  }
});

// Update User Information
router.put("/admin", adminAuthorization, async (req, res) => {
  const { address, apartment, cep, city, email, firstName, lastName, number, phone, state, userId, userStatus, birthDate } = req.body;
  try {
    const userInfoUpdate = await pool.query(
      "UPDATE users SET user_address = $1, user_apartment = $2, user_cep = $3, user_city = $4, user_email = $5, user_first_name = $6, user_last_name = $7, user_number = $8, user_phone = $9, user_state = $10, user_confirmed = $12, user_birth_date = $13 WHERE user_id = $11 RETURNING *",
      [address, apartment, cep, city, email, firstName, lastName, number, phone, state, userId, userStatus, birthDate]
    );
    console.log(userInfoUpdate.rows[0]);
    if (userInfoUpdate.rows[0]) {
      return res.status(200).json({
        message: "Informações atualizadas com sucesso!",
        type: "success",
      });
    } else {
      res.status(500).json({
        message: `Erro ao atualizar informações. ${err.message}`,
        type: "error",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: `Erro ao atualizar suas informações. ${err.message}`,
      type: "error",
    });
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
    return res.status(403).json({ message: "Usuário ou senha estão incorretos.", type: "error" });
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

router.get("/list", adminAuthorization, async (req, res) => {
  try {
    const userList = await pool.query(
      "SELECT user_id, user_email, user_first_name, user_last_name, user_gender, user_phone, user_cpf, user_birth_date, user_cep, user_state, user_city, user_address, user_number, user_apartment, user_role, user_confirmed FROM users"
    );
    res.status(200).json(userList.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/passwordRequest", async (req, res) => {
  try {
    const { resetEmail } = req.body;
    const verifyEmail = await pool.query("SELECT user_id, user_email, user_first_name FROM users WHERE user_email = $1", [resetEmail]);
    const verifyRequests = await pool.query("SELECT reset_id, reset_expiration FROM password_resets WHERE reset_user_id = $1", [
      verifyEmail.rows[0].user_id,
    ]);

    if (verifyRequests.rows[0]) {
      const requestExpiration = verifyRequests.rows[0].reset_expiration;
      if (requestExpiration - new Date() > 0) {
        return res.status(200).json({
          message: "Solicitação de senha realizada com sucesso",
          type: "success",
        });
      }
    }

    if (verifyEmail.rows[0]) {
      const expirationDate = new Date(Date.now() + 7200000); //2hrs from now
      const validUserEmail = verifyEmail.rows[0].user_email;
      const userId = verifyEmail.rows[0].user_id;
      const newPasswordReset = await pool.query(
        "INSERT INTO password_resets (reset_email,reset_user_id,reset_expiration) VALUES ($1,$2,$3) RETURNING *",
        [validUserEmail, userId, expirationDate]
      );
      const sgEmail = new Email([verifyEmail.rows[0].user_email]);
      const sendEmail = await sgEmail.sendPasswordReset(verifyEmail.rows[0].user_first_name, newPasswordReset.rows[0].reset_id);

      if (sendEmail.type === "error") {
        await pool.query("DELETE FROM password_resets WHERE reset_id = $1", [newPasswordReset.rows[0].reset_id]);
        res.status(400).json({
          message: "Erro ao solicitar nova senha. Por favor tente novamente.",
          type: "error",
        });
      }
    }
    res.status(200).json({
      message: "Solicitação de senha realizada com sucesso",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Erro ao solicitar nova senha. Por favor, tente novamente",
      type: "error",
    });
  }
});

router.get("/passwordRequest/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
  const isValidUuid = uuidRegex.test(requestId);

  if (!isValidUuid) {
    return res.status(400).json({ message: "Solicitação inválida ou expirada.", type: "error" });
  }

  const now = new Date();
  const verifyRequest = await pool.query("SELECT reset_id, reset_expiration FROM password_resets WHERE reset_id = $1", [requestId]);
  if (verifyRequest.rows[0]) {
    const requestExpiration = verifyRequest.rows[0].reset_expiration;
    if (requestExpiration - new Date() < 0) {
      return res.status(400).json({ message: "Solicitação inválida ou expirada.", type: "error" });
    }
  }
  return res.status(200).json({ message: "Solicitação valida.", type: "success" });
});

router.post("/passwordReset/:requestId", async (req, res) => {
  try {
    const { password } = req.body;
    const { requestId } = req.params;
    const lookupUser = await pool.query("SELECT reset_user_id FROM password_resets WHERE reset_id = $1", [requestId]);

    const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
    const isValidUuid = uuidRegex.test(requestId);

    if (!isValidUuid || !lookupUser.rows.length) {
      return res.status(400).json({ message: "Solicitação inválida ou expirada.", type: "error" });
    }

    // Encrypting password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Inserting user into DB
    const updateUser = await pool.query("UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING user_id, user_role, user_first_name", [
      bcryptPassword,
      lookupUser.rows[0].reset_user_id,
    ]);
    const deleteRequest = await pool.query("DELETE FROM password_resets WHERE reset_id = $1", [requestId]);

    // Logging in
    const token = jwtGenerator(updateUser.rows[0].user_id, updateUser.rows[0].user_role, updateUser.rows[0].user_first_name);
    return res.status(200).json({
      token: token,
      role: updateUser.rows[0].user_role,
      name: updateUser.rows[0].user_name,
      givenName: updateUser.rows[0].user_first_name,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// Delete Registrations (USER)
router.delete("/admin/:userId", adminAuthorization, async (req, res) => {
  try {
    const { userId } = req.params;

    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

    res.status(200).json({
      message: "Inscrição cancelada com sucesso.",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao cancelar a inscrição. ${err.message}`,
      type: "error",
    });
  }
});

// Authentication Route
router.get("/authentication", authorization, async (req, res) => {
  try {
    res.json({
      authentication: true,
      role: req.userRole,
      name: req.userName,
      givenName: req.userGivenName,
    });
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
