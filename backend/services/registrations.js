const pool = require("../database/database");
const crypto = require("crypto");
const { readOrder, installments, createOrder } = require("./pagarme");
const dayjs = require("dayjs");
const Email = require("../utils/emails");
const { readCategoryFromId } = require("./categories");

/**
 * Verifies if a registration is active for a given event and user.
 * @param {number} eventId - The ID of the event.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object|boolean>} - The registration object if active, otherwise false.
 */
async function verifyActiveRegistration(eventId, userId) {
  const checkForRegistration = await pool.query(
    "SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2",
    [eventId, userId]
  );

  if (
    checkForRegistration.rows[0] &&
    checkForRegistration.rows[0]?.registration_status === "completed"
  ) {
    return checkForRegistration.rows[0];
  } else {
    return false;
  }
}

async function readRegistration(registrationId) {
  const registration = await pool.query(
    "SELECT * FROM registrations WHERE registration_id = $1",
    [registrationId]
  );
  if (registration.rows[0].payment_id) {
    const order = await readOrder(registration.rows[0].payment_id);
    return {
      ...registration.rows[0],
    };
  }
  return registration.rows[0] ?? null;
}

/**
 * Creates a new registration.
 * @param {Object} registrationData - The data for the new registration.
 * @param {number} registrationData.eventId - The ID of the event.
 * @param {number} registrationData.userId - The ID of the user.
 * @param {number} registrationData.categoryId - The ID of the category.
 * @param {string} registrationData.registrationShirt - The registration shirt size.
 * @param {number} registrationData.paymentId - The ID of the payment.
 * @param {string} registrationData.registrationStatus - The status of the registration.
 * @param {number|null} registrationData.couponId - The ID of the coupon (optional).
 * @param {string|null} registrationData.registrationTeam - The registration team (optional).
 * @param {string|null} registrationData.registrationId - The registration ID (optional, generated if not provided).
 * @returns {Promise<Object>} - The newly created registration object.
 */
async function createRegistration({
  eventId,
  userId,
  categoryId,
  registrationShirt,
  paymentId,
  registrationStatus,
  couponId,
  registrationTeam,
  registrationId,
}) {
  const newRegistration = await pool.query(
    `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt, payment_id, registration_status, registration_date, coupon_id, registration_team, registration_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING registration_id`,
    [
      eventId,
      userId,
      categoryId,
      registrationShirt,
      paymentId,
      registrationStatus,
      new Date(),
      couponId || null,
      registrationTeam || null,
      registrationId ?? crypto.randomUUID(),
    ]
  );
  return newRegistration.rows[0];
}

/**
 * Updates the status of a registration.
 * @param {string} registrationId - The ID of the registration.
 * @param {string} status - The new status of the registration.
 * @returns {Promise<Object>} - The updated registration object.
 */
async function updateRegistrationStatus(registrationId, status) {
  const registration = await pool.query(
    "UPDATE registrations SET registration_status = $1 WHERE registration_id = $2 RETURNING *",
    [status, registrationId]
  );

  if (status === "completed") {
    const userInfo = await pool.query(
      "SELECT user_email, user_first_name FROM users WHERE user_id = $1",
      [registration.rows[0].user_id]
    );
    const eventInfo = await pool.query("SELECT * FROM events WHERE event_id = $1", [
      registration.rows[0].event_id,
    ]);
    const categoryInfo = await pool.query(
      "SELECT * FROM event_categories WHERE category_id = $1",
      [registration.rows[0].category_id]
    );
    const sgEmail = new Email([userInfo.rows[0].user_email]);
    await sgEmail.sendRegistrationEmail(
      userInfo.rows[0].user_first_name,
      eventInfo.rows[0].event_name,
      eventInfo.rows[0].event_date_start,
      eventInfo.rows[0].event_date_end,
      eventInfo.rows[0].event_location,
      categoryInfo.rows[0].category_name,
      registration.rows[0].registration_id,
      eventInfo.rows[0].event_link
    );
  }
  return registration.rows[0];
}

/**
 * Generates a new payment_id/url for a registration.
 * @param {string} registrationId - The ID of the registration.
 * @returns {Promise<Object>} - The updated registration object.
 */
async function updateRegistrationPaymentId(registrationId) {
  const registration = await readRegistration(registrationId);
  const category = await readCategoryFromId(registration.category_id);
  const cost = category.category_price;
  const order = await readOrder(registration.payment_id);
  if (!order) throw "Pedido não encontrado";

  const items = order.items;
  const customer = order.customer;
  const payments = [
    {
      payment_method: "checkout",
      amount: cost * 100 + cost * 10,
      checkout: {
        customer_editable: true,
        skip_checkout_success_page: true,
        accepted_payment_methods: ["credit_card", "pix"],
        success_url:
          process.env.NODE_ENV === "production"
            ? `https://cbmtb.com.br/pagamento`
            : `http://localhost:3000/pagamento`,
        credit_card: {
          capture: true,
          statement_descriptor: "CBMTBINSCR",
          installments: installments.map((i) => ({
            number: i.installments,
            total: cost * 100 + cost * 10 + cost * 100 * i.tax,
          })),
        },
        pix: {
          expires_in: 86400,
        },
      },
      metadata: {
        registrationId: registration.registration_id,
        userId: registration.user_id,
        eventId: registration.event_id,
      },
    },
  ];

  const newPayment = await createOrder({ items, customer, payments });

  const updatedRegistration = await pool.query(
    "UPDATE registrations SET payment_id = $1 WHERE registration_id = $2 RETURNING *",
    [newPayment.id, registrationId]
  );

  return {
    payment_url: newPayment.checkouts[0].payment_url,
    ...updatedRegistration.rows[0],
  };
}

module.exports = {
  verifyActiveRegistration,
  createRegistration,
  updateRegistrationStatus,
  updateRegistrationPaymentId,
  readRegistration,
};
