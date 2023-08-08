const axios = require("axios").default;
var fs = require("fs");

const headers = {
  Authorization:
    "Basic " + Buffer.from(`${process.env.PAGARME_SECRET}:`).toString("base64"),
  "Content-Type": "application/json",
  accept: "application/json",
};

async function createOrder(req, res) {
  const { data } = await axios.post(
    "https://api.pagar.me/core/v5/orders",
    req.body,
    {
      headers: headers,
    }
  );
  return res.json(data);
}

async function verifyPayment(req, res) {
  const { id } = req.params;
  const { data } = await axios.get(
    `https://api.pagar.me/core/v5/orders/${id}`,
    {
      headers: headers,
    }
  );
  return res.json(data);
}

module.exports = { createOrder, verifyPayment };
