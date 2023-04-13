const router = require("express").Router();
const reCaptcha = require("../middlewares/reCaptcha");
const pool = require("../database/database");
const dayjs = require("dayjs");

// Send Press Form
router.post("/press", reCaptcha, async (req, res) => {
  try {
    const { fullName, email, type, vehicle, comments, phone, cpf } = req.body;
    const verifyEmail = await pool.query(
      "SELECT press_email FROM press WHERE press_email = $1",
      [email]
    );
    const verifyCPF = await pool.query(
      "SELECT press_cpf FROM press WHERE press_cpf = $1",
      [cpf]
    );

    if (verifyEmail.rows.length) {
      return res.status(400).json({
        message: "Email já registrado no sistema!",
        type: "error",
        field: "email",
      });
    }

    if (verifyCPF.rows.length) {
      return res.status(400).json({
        message: "CPF já registrado no sistema!",
        type: "error",
        field: "cpf",
      });
    }

    const newPressVehicle = await pool.query(
      "INSERT INTO press (press_rep,press_email,press_phone,press_cpf,press_type,press_vehicle,press_comment) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [fullName, email, phone, cpf, type, vehicle, comments]
    );

    res.status(200).json({
      message: "Cadastro de imprensa realizado com sucesso!",
      type: "success",
    });
  } catch (err) {
    res.status(400).json({
      message: `Erro ao realizar o cadastro. ${err.message}`,
      type: "error",
    });
    console.log(err.message);
  }
});

module.exports = router;
