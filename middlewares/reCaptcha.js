const { default: axios } = require("axios");

module.exports = async (req, res, next) => {
  const body = req.body;
  if (!body.reCaptcha) {
    return res.status(400).json({ message: "Captcha inválido. Por favor preencha novamente.", type: "error" });
  }

  axios
    .post(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        response: body.reCaptcha,
        secret: process.env.NODE_ENV === "production" ? process.env.GOOGLE_RECAPTCHA_SECRET_KEY : "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe",
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then(function (response) {
      if (response.data.success !== true) {
        return res.status(400).json({ message: `Captcha inválido, por favor tente novamente. ${error}`, type: "error" });
      }
    })
    .catch(function (error) {
      return res.status(500).json({ message: `Erro ao processar o Captcha, por favor tente novamente. ${error}`, type: "error" });
    });

  next();
};
