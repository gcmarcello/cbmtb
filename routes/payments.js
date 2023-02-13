const router = require("express").Router();
const GNRequest = require("../apis/gerenciaNet");

const reqGNInit = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET,
});

router.get("/pix/", async (req, res) => {
  const reqGN = await reqGNInit;
  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: "1.00",
    },
    chave: "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
    solicitacaoPagador: "Informe o número ou identificador do pedido.",
  };

  const cobResponse = await reqGN.post("/v2/cob", dataCob);
  const qrCodeResponse = await reqGN.get(`v2/loc/${cobResponse.data.loc.id}/qrcode`);
  res.status(200).json(qrCodeResponse.data);
});

router.get("/bill", async (req, res) => {
  console.log("Test");
  const reqGN = await reqGNInit;
  const cobResponse = await reqGN.get("/v2/cob?inicio=2023-01-15T16:01:35Z&fim=2023-02-22T23:59:00Z");
  res.json(cobResponse.data);
});

router.post("/webhook(/pix)?", (req, res) => {
  console.log(req.body);
  res.json("200");
});

module.exports = router;
