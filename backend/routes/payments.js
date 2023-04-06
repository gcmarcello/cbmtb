const router = require("express").Router();
/* const GNRequest = require("../apis/gerenciaNet"); */
const crypto = require("crypto");
const pool = require("../database/database");
const authorization = require("../middlewares/authorization");

const config = require("../config");

router.get("/bill", async (req, res) => {
  const reqGN = await GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET,
  });
  const cobResponse = await reqGN.get(
    "/v2/cob?inicio=2023-01-15T16:01:35Z&fim=2023-02-22T23:59:00Z"
  );
  res.json(cobResponse.data);
});

router.post("/webhook", (request, response) => {
  // Verifica se a requisição que chegou nesse endpoint foi autorizada
  if (request.socket.authorized) {
    response.status(200).end();
  } else {
    response.status(401).end();
  }
});

router.post("/webhook(/pix)?", (req, res) => {
  console.log(req.body);
  res.json("200");
});

router.get("/pix/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const fetchPayment = await pool.query(
      "SELECT * FROM payments WHERE payment_id = $1",
      [id]
    );
    const { payment_value } = fetchPayment.rows[0];

    if (payment_value === 0) {
      return res
        .status(200)
        .json({ message: "Inscrição realizada com sucesso!", type: "success" });
    }

    const reqGN = await GNRequest({
      clientID: process.env.GN_CLIENT_ID,
      clientSecret: process.env.GN_CLIENT_SECRET,
    });
    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        original: `${payment_value}.00`,
      },
      chave: "abbe6861-4ed1-4567-836f-59c8bc2b08ba",
      solicitacaoPagador: `${config.entidade.name} - ${config.siteUrl}`,
    };
    const uuidTxid = crypto.randomUUID().replace(/-/g, "");
    const updatePayment = await pool.query(
      "UPDATE payments SET payment_txid = $1 WHERE payment_id = $2 RETURNING payment_txid",
      [uuidTxid, id]
    );

    const cobResponse = await reqGN.put(
      `/v2/cob/${updatePayment.rows[0].payment_txid}`,
      dataCob
    );
    const qrCodeResponse = await reqGN.get(
      `v2/loc/${cobResponse.data.loc.id}/qrcode`
    );
    res.json({ ...cobResponse.data, ...qrCodeResponse.data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/pix/review/:id", authorization, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const fetchPayment = await pool.query(
      "SELECT * FROM payments WHERE payment_id = $1 and user_id = $2",
      [id, userId]
    );
    if (!fetchPayment.rows.length) {
      return res.status(404).json({
        message: "Esse pagamento não existe ou não é vinculado ao seu usuário.",
        type: "error",
      });
    }
    const reqGN = await GNRequest({
      clientID: process.env.GN_CLIENT_ID,
      clientSecret: process.env.GN_CLIENT_SECRET,
    });
    const cobResponse = await reqGN.get(
      `/v2/cob/${fetchPayment.rows[0].payment_txid}`
    );
    const qrCodeResponse = await reqGN.get(
      `v2/loc/${cobResponse.data.loc.id}/qrcode`
    );
    res.json({ ...cobResponse.data, ...qrCodeResponse.data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
