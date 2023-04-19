const router = require("express").Router();
const path = require("path");
require("dotenv").config();
const Gerencianet = require("gn-api-sdk-node");

router.get("/", async (req, res) => {
  const options = {
    sandbox: process.env.NODE_ENV === "development" ? true : false,
    client_id: process.env.GN_CLIENT_ID,
    client_secret: process.env.GN_CLIENT_SECRET,
    certificate: path.join(__dirname, "../../certs", process.env.GN_CERT),
  };

  let body = {
    calendario: {
      expiracao: 3600,
    },
    devedor: {
      cpf: "94271564656",
      nome: "Gorbadock Oldbuck",
    },
    valor: {
      original: "123.45",
    },
    chave: "MYKEY", // Informe sua chave Pix cadastrada na gerencianet	//o campo abaixo é opcional
  };

  let params = {
    txid: "dt9BHlyzrb5jrFNAdfEY0TJgiOmDbVq117",
  };

  const gerencianet = new Gerencianet(options);

  const createPix = await gerencianet
    .pixCreateCharge(params, body)
    .then((resposta) => {
      return resposta;
    })
    .catch((error) => {
      console.log(error);
    });

  const generateQRCode = await gerencianet
    .pixGenerateQRCode({ id: createPix.loc.id })
    .then((resposta) => {
      console.log(resposta);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
