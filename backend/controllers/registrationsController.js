const crypto = require("crypto");
const pool = require("../database/database");
const Email = require("../utils/emails");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const paymentsController = require("../controllers/paymentsController");
dayjs.extend(isBetween);
const axios = require("axios").default;

async function create_registration(req, res) {
  try {
    const { id, userId } = req;
    const { category, registrationShirt } = req.body;
    const checkForRegistration = await pool.query(
      "SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkForRegistration.rows[0]) {
      res
        .status(200)
        .json({ message: "Você já se inscreveu neste evento!", type: "error" });
      return;
    }

    const eventCost = await pool.query(
      "SELECT category_price FROM event_categories WHERE category_id = $1",
      [category]
    );

    let paymentStatus =
      eventCost.rows[0].category_price > 0 ? "pending" : "completed";

    const registration = async () => {
      paymentStatus = "completed";
      const newRegistrations = await pool.query(
        `INSERT INTO registrations (event_id,user_id,category_id,registration_shirt, payment_id, registration_status, registration_date, coupon_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING registration_id`,
        [
          id,
          userId,
          category,
          registrationShirt,
          null,
          paymentStatus,
          new Date(),
          req.couponId || null,
        ]
      );

      const userInfo = await pool.query(
        "SELECT user_email, user_first_name FROM users WHERE user_id = $1",
        [userId]
      );
      const eventInfo = await pool.query(
        "SELECT * FROM events WHERE event_id = $1",
        [id]
      );
      const categoryInfo = await pool.query(
        "SELECT * FROM event_categories WHERE category_id = $1",
        [category]
      );
      const sgEmail = new Email([userInfo.rows[0].user_email]);
      sgEmail.sendRegistrationEmail(
        userInfo.rows[0].user_first_name,
        eventInfo.rows[0].event_name,
        eventInfo.rows[0].event_date_start,
        eventInfo.rows[0].event_date_end,
        eventInfo.rows[0].event_location,
        categoryInfo.rows[0].category_name,
        newRegistrations.rows[0].registration_id,
        eventInfo.rows[0].event_link
      );

      return {
        message: "Inscrição realizada com sucesso.",
        type: "success",
      };
    };

    if (paymentStatus === "completed") return res.json(registration());
    if (paymentStatus === "pending") {
      const headers = {
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.PAGARME_SECRET}:`).toString("base64"),
        "Content-Type": "application/json",
        accept: "application/json",
      };
      if (req.body.paymentMethod === "pix") {
        const id = req.body.order_id;
        const dataPix = await axios.get(
          `https://api.pagar.me/core/v5/orders/${id}`,
          {
            headers: headers,
          }
        );
        if (dataPix.data.status !== "paid") {
          return res.json({
            type: "error",
            message: "Pagamento não foi detectado.",
          });
        }
      } else {
        console.log(req.body, 104);
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
        const ccInfo = {
          customer: {
            name: req.body.firstName + " " + req.body.lastName,
            type: "individual",
            email: req.body.email,
            code: req.body.email,
            document: req.body.cpf.replace(/[.-]/g, ""),
            document_type: "CPF",
            gender: req.body.gender === "Masculino" ? "male" : "female",
            phones: {
              mobile_phone: {
                country_code: "55",
                area_code: req.body.phone.split(" ")[0],
                number: req.body.phone.split(" ")[1].replace("-", ""),
              },
            },
            address: {
              line_1: req.body.address,
              line_2: req.body.number,
              zip_code: req.body.cep,
              city: req.body.city,
              state: req.body.state,
              country: "BR",
            },

            birthdate: req.body.birthDate,
          },
          items: [
            {
              amount:
                Math.ceil(
                  eventCost.rows[0].category_price +
                    eventCost.rows[0].category_price * 0.1 +
                    eventCost.rows[0].category_price *
                      installments.find(
                        (installment) =>
                          installment.installments ===
                          Number(req.body.installments)
                      ).tax
                ) * 100,
              description: "Inscrição CBMTB",
              quantity: 1,
              code: category,
            },
          ],
          payments: [
            {
              credit_card: {
                card: {
                  billing_address: {
                    line_1: req.body.address,
                    line_2: req.body.number,
                    zip_code: req.body.cep,
                    city: req.body.city,
                    state: req.body.state,
                    country: "BR",
                  },
                },
                installments: Number(req.body.installments),
                statement_descriptor: "CBMTBINSCR",
                card_token: req.body.cc_token,
                operation_type: "auth_and_capture",
              },
              payment_method: "credit_card",
            },
          ],
        };
        const data = await axios
          .post("https://api.pagar.me/core/v5/orders/", ccInfo, {
            headers: headers,
          })
          .then((response) => console.log(response, 190))
          .catch((error) => {
            console.log(error.response.data.errors);
          });
        if (data.status && data.status !== "paid") {
          console.log(data.charges[0].last_transaction.gateway_response, 195);
          return res.json({
            message: "Erro ao confirmar pagamento.",
            type: "error",
          });
        }
      }
      return res.json(await registration());
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Erro ao finalizar inscrição.",
      type: "error",
    });
  }
}

async function read_user_registrations(req, res) {
  try {
    const userId = req.userId;
    const registrations = await pool.query(
      "SELECT r.registration_status, r.registration_id, r.registration_shirt, r.registration_date, r.registration_id, r.payment_id, c.category_name, e.event_id, e.event_name, e.event_location, e.event_date_start, e.event_image FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN event_categories AS c ON r.category_id = c.category_id LEFT JOIN events AS e ON c.event_id = e.event_id WHERE u.user_id = $1",
      [userId]
    );

    res.status(200).json(registrations.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function update_registration(req, res) {
  try {
    const { registrationShirt, registrationCategory, registrationId } =
      req.body;

    const updateRegistration = await pool.query(
      "UPDATE registrations SET registration_shirt = $1, category_id = $2 WHERE registration_id = $3 RETURNING *",
      [registrationShirt, registrationCategory, registrationId]
    );

    res.status(200).json({
      message: "Inscrição atualizada com sucesso!",
      type: "success",
      data: updateRegistration.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao alterar inscrição. ${err.message}`,
      type: "success",
    });
  }
}

async function delete_registration(req, res) {
  try {
    const { eventId, registrationId } = req.params;
    const userId = req.userId;

    const deleteRegistration = await pool.query(
      "DELETE FROM registrations WHERE registration_id = $1 AND user_id = $2 RETURNING *",
      [registrationId, userId]
    );

    const userInfo = (
      await pool.query(
        "SELECT user_first_name, user_email FROM users WHERE user_id = $1",
        [userId]
      )
    ).rows[0];
    const eventInfo = (
      await pool.query(
        "SELECT event_name, event_link FROM events WHERE event_id = $1",
        [eventId]
      )
    ).rows[0];

    const sgEmail = new Email([userInfo.user_email]);
    sgEmail.sendRegistrationCancellationEmail(
      userInfo.user_first_name,
      eventInfo.event_name,
      eventInfo.event_link
    );

    res.status(200).json({
      message: "Inscrição cancelada com sucesso.",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao cancelar a inscrição. ${err.message}`,
      type: "error",
    });
  }
}

async function delete_registration_admin(req, res) {
  try {
    const { eventId, registrationId } = req.params;

    const deleteRegistration = await pool.query(
      "DELETE FROM registrations WHERE registration_id = $1 RETURNING *",
      [registrationId]
    );

    const userInfo = (
      await pool.query(
        "SELECT user_first_name, user_email FROM users WHERE user_id = $1",
        [deleteRegistration.rows[0].user_id]
      )
    ).rows[0];
    const eventInfo = (
      await pool.query(
        "SELECT event_name, event_link FROM events WHERE event_id = $1",
        [eventId]
      )
    ).rows[0];

    const sgEmail = new Email([userInfo.user_email]);
    sgEmail.sendRegistrationCancellationEmail(
      userInfo.user_first_name,
      eventInfo.event_name,
      eventInfo.event_link
    );

    res.status(200).json({
      message: "Inscrição cancelada com sucesso.",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao cancelar a inscrição. ${err.message}`,
      type: "error",
    });
  }
}

async function check_registration(req, res) {
  try {
    let { id, coupon } = req.params;
    const userId = req.userId;
    const typeOfLink =
      /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(
        id
      );

    if (!typeOfLink) {
      const response = await pool.query(
        "SELECT event_id FROM events WHERE event_link = $1",
        [id]
      );
      if (response.rows[0]) {
        id = await response.rows[0].event_id;
      } else {
        return res
          .status(404)
          .json({ message: "Evento não existe", type: "error" });
      }
    }

    const checkForAvailability = await pool.query(
      "SELECT event_registrations_start, event_registrations_end, event_status, event_general_attendees FROM events WHERE event_id = $1",
      [id]
    );

    let checkForRegistration;
    let checkForUser;
    let userAge;

    if (req.userId) {
      checkForRegistration = await pool.query(
        "SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2",
        [id, userId]
      );
      checkForUser = await pool.query(
        "SELECT * from users WHERE user_id = $1",
        [userId]
      );
      userAge = dayjs().diff(checkForUser.rows[0].user_birth_date, "years");

      // Checking if user is already registered
      if (checkForRegistration.rows[0]) {
        return res.status(200).json({ message: "Inscrito!", type: "error" });
      }
      const gender =
        checkForUser.rows[0].user_gender === "Masculino" ? "masc" : "fem";

      const listOfCategories = await pool.query(
        "SELECT * FROM event_categories WHERE (event_id = $1) AND (category_minage <= $2) AND (category_maxage >= $2) AND (category_gender = $3 OR category_gender = 'unisex') ORDER BY category_maxage ASC",
        [id, userAge, gender]
      );

      if (!listOfCategories.rows[0]) {
        return res.status(200).json({
          message:
            "Esse evento não tem nenhuma categoria disponível para você.",
          type: "error",
        });
      }

      if (coupon) {
        const validateCoupon = await pool.query(
          "SELECT * FROM event_coupons WHERE event_id = $1 AND coupon_link = $2",
          [id, coupon]
        );
        if (!validateCoupon.rows[0]) {
          return res
            .status(200)
            .json({ message: "Página não encontrada.", type: "error" });
        }
        const verifyAvailability = await pool.query(
          "SELECT * FROM registrations AS r LEFT JOIN event_coupons AS ec ON r.coupon_id = ec.coupon_id WHERE r.event_id = $1 AND ec.coupon_link = $2",
          [id, coupon]
        );
        if (
          verifyAvailability.rows.length >= validateCoupon.rows[0].coupon_uses
        ) {
          return res
            .status(200)
            .json({ message: "Cupom Esgotado.", type: "error" });
        }
        return res.status(200).json({
          message: "Cupom Disponível!",
          type: "success",
        });
      }
    }

    const registrationStarts = dayjs(
      checkForAvailability.rows[0].event_registrations_start
    );
    const registrationEnds = dayjs(
      checkForAvailability.rows[0].event_registrations_end
    );
    const maxAttendees = checkForAvailability.rows[0].event_general_attendees;
    const fetchAttendees = await pool.query(
      "SELECT event_id, COUNT(*) as num_attendees FROM registrations WHERE coupon_id IS NULL AND event_id = $1 GROUP BY event_id",
      [id]
    );
    const currentAttendees = Number(fetchAttendees.rows[0]?.num_attendees || 0);
    const periodVerification = dayjs().isBetween(
      registrationStarts,
      registrationEnds,
      null,
      []
    );

    // Checking for manual registration status
    if (checkForAvailability.rows[0].event_status !== "open") {
      return res
        .status(200)
        .json({ message: "Inscrições Indisponíveis", type: "error" });
    }

    // Checking for number of registrations
    if (currentAttendees >= maxAttendees) {
      return res
        .status(200)
        .json({ message: "Inscrições Esgotadas", type: "error" });
    }

    // Checking for registration period
    if (dayjs().isBefore(dayjs(registrationStarts))) {
      return res
        .status(200)
        .json({ message: "Inscrições Em Breve", type: "error" });
    }

    // Checking for registration period
    if (!periodVerification) {
      return res
        .status(200)
        .json({ message: "Inscrições Encerradas", type: "error" });
    }

    return res.status(200).json({
      message: "Inscrições Disponíveis!",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function verify_registration(req, res) {
  const { id, eventId } = req.params;
  try {
    const verifyRegistration = await pool.query(
      "SELECT u.user_first_name, u.user_last_name, u.user_birth_date, ec.category_name, r.registration_status, r.registration_checkin, r.registration_id FROM users AS u LEFT JOIN registrations as r on u.user_id = r.user_id LEFT JOIN event_categories AS ec ON r.category_id = ec.category_id WHERE r.registration_id = $1 AND r.event_id = $2",
      [id, eventId]
    );

    if (!verifyRegistration.rowCount) {
      return res
        .status(404)
        .json({ message: "Erro ao encontrar inscrição", type: "error" });
    }

    if (verifyRegistration.rows[0].registration_status !== "completed") {
      return res
        .status(403)
        .json({ message: "Esta inscrição não foi confirmada", type: "error" });
    }

    return res
      .status(200)
      .json({ data: verifyRegistration.rows[0], type: "success" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao buscar inscrição", type: "error" });
  }
}

async function checkin_registration(req, res) {
  const { id } = req.params;
  try {
    const verifyRegistration = await pool.query(
      "SELECT * FROM registrations WHERE registration_id = $1",
      [id]
    );

    if (!verifyRegistration.rowCount) {
      console.log({ message: "Erro ao encontrar inscrição", type: "error" });
      return res
        .status(404)
        .json({ message: "Erro ao encontrar inscrição", type: "error" });
    }

    if (verifyRegistration.rows[0].registration_status !== "completed") {
      console.log({
        message: "Esta inscrição não foi confirmada",
        type: "error",
      });
      return res
        .status(403)
        .json({ message: "Esta inscrição não foi confirmada", type: "error" });
    }

    const checkinRegistration = await pool.query(
      "UPDATE registrations SET registration_checkin = true WHERE registration_id = $1",
      [id]
    );

    return res.status(200).json({
      data: verifyRegistration.rows[0],
      message: "Check-in Realizado!",
      type: "success",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao buscar inscrição", type: "error" });
  }
}

async function list_event_registrations(req, res) {
  const { id, type } = req.params;
  try {
    let registrationList;
    const eventInfo = await pool.query(
      "SELECT event_name, event_id, event_status FROM events WHERE event_id = $1",
      [id]
    );

    if (type === "noshow") {
      registrationList = await pool.query(
        "SELECT user_first_name, user_last_name, user_cpf, registrations.user_id, registration_id FROM registrations LEFT JOIN users ON registrations.user_id = users.user_id WHERE event_id = $1 AND (NOT registration_checkin OR registration_checkin IS NULL)",
        [id]
      );
    } else {
      registrationList = await pool.query(
        "SELECT COUNT(*) as total_attendees, COUNT(CASE WHEN registration_checkin = true THEN 1 END) AS checkedin_attendees FROM registrations WHERE event_id = $1",
        [id]
      );
    }

    res.status(200).json({
      data: {
        eventInfo: eventInfo.rows[0],
        attendeeCount: type ? registrationList.rows : registrationList.rows[0],
      },
      message: "Lista de inscritos atualizada",
      type: "success",
    });
  } catch (error) {
    res.status(400).json({
      message: `Erro ao atualizar a lista de inscritos. ${error.message}`,
      type: "error",
    });
  }
}

module.exports = {
  create_registration,
  read_user_registrations,
  update_registration,
  delete_registration,
  delete_registration_admin,
  check_registration,
  verify_registration,
  checkin_registration,
  list_event_registrations,
};
