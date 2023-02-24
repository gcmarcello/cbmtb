const router = require("express").Router();
const pool = require("../database");
const bcrypt = require("bcrypt");
const registrationValidation = require("./middlewares/registrationValidation");
const authorization = require("./middlewares/authorization");
const jwtGenerator = require("../utils/jwtGenerator");

// Register Route
router.post("/register", registrationValidation, async (req, res) => {
  const { username, email, password, name, lastName, cpf, birthDate, phone, gender, cep, state, city, neighborhood, street, number, apartment } =
    req.body;
  try {
    // Encrypting password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Inserting user into DB
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_given_name, user_last_name, user_cpf, user_gender, user_phone, user_birth_date, user_cep, user_state, user_city, user_neighborhood, user_street, user_number, user_apartment, user_role) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *",
      [
        username,
        email,
        bcryptPassword,
        name,
        lastName,
        cpf,
        gender,
        phone,
        birthDate,
        cep,
        state,
        city,
        neighborhood,
        street,
        number,
        apartment,
        "user",
      ]
    );

    //JWT
    const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].user_name, newUser.rows[0].user_role, newUser.rows[0].user_given_name);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userVerification = await pool.query("SELECT * FROM users WHERE user_name = $1", [username]);
  if (!userVerification.rows[0]) {
    return res.status(400).json("Usuário ou senha estão incorretos.");
  }

  if (await bcrypt.compare(password, userVerification.rows[0].user_password)) {
    try {
      const token = jwtGenerator(
        userVerification.rows[0].user_id,
        userVerification.rows[0].user_name,
        userVerification.rows[0].user_role,
        userVerification.rows[0].user_given_name
      );
      res.json({
        token: token,
        role: userVerification.rows[0].user_role,
        name: userVerification.rows[0].user_name,
        givenName: userVerification.rows[0].user_given_name,
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
      "SELECT user_name, user_email, user_given_name, user_last_name, user_gender, user_phone, user_cpf, user_birth_date, user_cep, user_state, user_city, user_neighborhood, user_street, user_number, user_apartment FROM users WHERE user_id = $1",
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
