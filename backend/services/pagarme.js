const axios = require("axios").default;
var fs = require("fs");

const headers = {
  Authorization:
    "Basic " + Buffer.from(`${process.env.PAGARME_SECRET}:`).toString("base64"),
  "Content-Type": "application/json",
  accept: "application/json",
};

/**
 * Array of installment objects.
 * @typedef {Object} Installment
 * @property {number} installments - The number of installments.
 * @property {number} tax - The tax percentage for the installments.
 */

/**
 * Array of available installments.
 * @type {Installment[]}
 */
const installments = [
  { installments: 1, tax: 0 },
  { installments: 2, tax: 0 },
  { installments: 3, tax: 0 },
  { installments: 4, tax: 0.1 },
  { installments: 5, tax: 0.1 },
  { installments: 6, tax: 0.1 },
  { installments: 7, tax: 0.2 },
  { installments: 8, tax: 0.2 },
  { installments: 9, tax: 0.2 },
  { installments: 10, tax: 0.3 },
  { installments: 11, tax: 0.3 },
  { installments: 12, tax: 0.3 },
];

/**
 * Generates a new order.
 * @returns {Promise<Object>} - The updated registration object.
 */
async function createOrder(paymentInfo) {
  console.dir(paymentInfo, { depth: null });
  try {
    const { data } = await axios.post(
      "https://api.pagar.me/core/v5/orders",
      paymentInfo,
      {
        headers: headers,
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Generates a new payment_id/url for a registration.
 * @param {string} orderId - The ID of the registration.
 * @returns {Promise<Object>} - The updated registration object.
 */
async function readOrder(orderId) {
  try {
    const { data } = await axios.get(`https://api.pagar.me/core/v5/orders/${orderId}`, {
      headers: headers,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { createOrder, readOrder, installments };
