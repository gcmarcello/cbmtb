const router = require("express").Router();
const GNRequest = require("../apis/gerenciaNet");
const crypto = require("crypto");

router.get("/pix", async (req, res) => {
  const key = crypto.randomUUID().replace(/-/g, "");
  const reqGN = await GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET,
  });
  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: "0.10",
    },
    chave: "abbe6861-4ed1-4567-836f-59c8bc2b08ba",
    solicitacaoPagador: "CBMTB - cbmtb.com",
  };

  const cobResponse = await reqGN.put(`/v2/cob/${key}`, dataCob);
  console.log(cobResponse.data);
  const qrCodeResponse = await reqGN.get(`v2/loc/${cobResponse.data.loc.id}/qrcode`);
  res.status(200).json(qrCodeResponse.data);
});

router.get("/bill", async (req, res) => {
  const reqGN = await reqGNInit;
  const cobResponse = await reqGN.get("/v2/cob?inicio=2023-01-15T16:01:35Z&fim=2023-02-22T23:59:00Z");
  res.json(cobResponse.data);
});

router.post("/webhook(/pix)?", (req, res) => {
  console.log(req.body);
  res.json("200");
});

module.exports = router;
