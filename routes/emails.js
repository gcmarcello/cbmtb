const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");
const cors = require("cors");

const sgMail = require("@sendgrid/mail");

router.post("/recovery/:id", adminAuthorization, async (req, res) => {
  try {
    return res.json(list);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/newsletter/", async (req, res) => {
  try {
    const { email } = req.body;

    const checkEmail = await pool.query("SELECT * FROM newsletter_subscribers WHERE subscriber_email = $1", [email]);

    if (checkEmail.rows[0]) {
      return res.status(400).json({ message: `Erro ao se inscrever na newsletter. Este email já existe.`, type: "error" });
    }

    return res.status(200).json({ message: "Inscrição realizada com sucesso!. Você receberá uma confirmação por e-mail.", type: "success" });
  } catch (err) {
    return res.status(400).json({ message: `Erro ao se inscrever na newsletter. ${err.message}`, type: "error" });
  }
});

router.post("/teste/", cors({ origin: "http://example.com" }), async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "marcellog.c@hotmail.com", // Change to your recipient
      from: {
        name: "CBMTB - Confederação Brasileira de Mountain Bike",
        email: "noreply@cbmtb.com",
      }, // Change to your verified sender
      subject: "Email teste confirmação de conta",
      html: "<h2>Confirmação de Criação de Conta</h2><p>Prezado(a) [NOME DO USUÁRIO],</p><p>Obrigado por criar uma conta em nosso site! Sua conta foi criada com sucesso e agora você pode aproveitar todos os recursos que oferecemos.</p><p>Para começar, por favor confirme o seu endereço de e-mail clicando no link abaixo:</p><p><a href='#'>Confirmar Conta</a></p><p>Se você não criou esta conta, por favor, ignore este e-mail.</p><p>Obrigado mais uma vez por se inscrever em nosso site. Estamos ansiosos para vê-lo(a) lá!</p><br><p>Atenciosamente,</p><p>[A EQUIPE DO SITE]</p>",
    };
    /* sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      }); */
    return res.status(200).json({ message: "Inscrição realizada com sucesso!. Você receberá uma confirmação por e-mail.", type: "success" });
  } catch (err) {
    return res.status(400).json({ message: `Erro ao se inscrever na newsletter. ${err.message}`, type: "error" });
  }
});

module.exports = router;
