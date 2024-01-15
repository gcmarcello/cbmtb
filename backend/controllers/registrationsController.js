const pool = require("../database/database");
const Email = require("../utils/emails");
const crypto = require("crypto");
const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const {
  verifyActiveRegistration,
  createRegistration,
  updateRegistrationPaymentId,
  readRegistration,
} = require("../services/registrations");
const { readEventFromId } = require("../services/events");
const { readUserFromId } = require("../services/user");
const { verifyCoupon } = require("../services/coupons");
const { installments, createOrder } = require("../services/pagarme");
const { readCategoryFromId } = require("../services/categories");
dayjs.extend(isBetween);
const axios = require("axios").default;

async function create_registration(req, res) {
  try {
    const { id, userId } = req;
    const { category, registrationShirt } = req.body;

    const event = await readEventFromId(id);

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado", type: "error" });
    }

    const checkForRegistration = await verifyActiveRegistration(id, userId);

    if (checkForRegistration) {
      return res.status(200).json({
        message: "Inscrição já confirmada.",
        type: "error",
      });
    }

    const user = await readUserFromId(userId);
    const categoryInfo = await readCategoryFromId(category);
    const cost = categoryInfo.category_price;
    const coupon = req.couponId;

    if (coupon) {
      const verifyUsedCoupon = await verifyCoupon(coupon, id);

      if (verifyUsedCoupon.type === "error") {
        return res.status(200).json(verifyUsedCoupon);
      }
    }

    const registrationId = crypto.randomUUID();

    const paymentInfo = {
      items: [
        {
          amount: cost * 100 + cost * 0.1,
          description: `Inscrição ${event.event_name}`,
          quantity: 1,
        },
      ],
      customer: {
        name: [user.user_first_name, user.user_last_name].join(" "),
        email: user.user_email,
        type: "individual",
        document: user.user_cpf.replace(/[.-]/g, ""),
        phones: {
          home_phone: {
            country_code: "55",
            number: user.user_phone.split(" ")[1].replace(/[.-]/g, ""),
            area_code: user.user_phone.split(" ")[0],
          },
        },
      },
      payments: [
        {
          payment_method: "checkout",
          amount: cost * 100 + cost * 10,
          checkout: {
            customer_editable: true,
            expires_in: 1440,
            skip_checkout_success_page: true,
            accepted_payment_methods: ["credit_card", "pix"],
            success_url:
              process.env.NODE_ENV === "production"
                ? `https://www.cbmtb.com.br/usuario`
                : `http://localhost:3000/usuario`,
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
        },
      ],
      metadata: {
        registrationId: registrationId,
        userId: userId,
        eventId: id,
      },
    };

    let order;
    if (cost !== 0) {
      order = await createOrder(paymentInfo);
    }

    const newRegistration = await createRegistration({
      categoryId: category,
      userId,
      eventId: id,
      registrationShirt,
      couponId: req.couponId || null,
      registrationTeam: req.body.registration_team || null,
      registrationStatus: cost === 0 ? "completed" : "pending",
      paymentId: cost === 0 ? null : order.id,
      registrationId,
    });

    if (cost === 0) {
      return res.status(200).json({
        message: "Inscrição Confirmada com Sucesso!",
        type: "success",
        data: undefined,
      });
    }

    return res.status(200).json({
      message: "Link de pagamento criado!",
      type: "success",
      data: order.checkouts[0].payment_url,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "Erro ao finalizar inscrição.",
      type: "error",
    });
  }
}

async function verify_registration_status(req, res) {
  const { userId } = req;
  const { id } = req.params;
  const checkForRegistration = await pool.query(
    "SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2",
    [id, userId]
  );

  if (checkForRegistration.rows[0].registration_status !== "completed") {
    return res.status(200).json({
      message: `Inscrição não confirmada.`,
      type: "error",
    });
  }

  return res.status(200).json({
    message: `Inscrição confirmada.`,
    type: "success",
  });
}

async function read_user_registrations(req, res) {
  try {
    const userId = req.userId;
    const registrations = await pool.query(
      "SELECT r.registration_status, r.registration_id, r.registration_shirt, r.registration_date, r.registration_id, r.payment_id, c.category_name, c.category_price, e.event_id, e.event_name, e.event_location, e.event_date_start, e.event_image FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN event_categories AS c ON r.category_id = c.category_id LEFT JOIN events AS e ON c.event_id = e.event_id WHERE u.user_id = $1",
      [userId]
    );

    res.status(200).json(registrations.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function update_registration(req, res) {
  try {
    const { registrationShirt, registrationCategory, registrationId } = req.body;

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

async function update_registration_payment(req, res) {
  try {
    const registration = await readRegistration(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({
        message: "Inscrição não encontrada.",
        type: "error",
      });
    }
    if (!registration.payment_url) {
      const newPaymentId = await updateRegistrationPaymentId(
        registration.registration_id
      );
      return res.status(200).json({
        message: "Link de pagamento criado!",
        type: "success",
        data: newPaymentId.payment_url,
      });
    }
    return res.status(200).json({
      message: "Link de pagamento já criado!",
      type: "success",
      data: registration.payment_url,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `Erro ao gerar pagamento. ${error.message}`,
      type: "error",
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
      await pool.query("SELECT event_name, event_link FROM events WHERE event_id = $1", [
        eventId,
      ])
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
      await pool.query("SELECT event_name, event_link FROM events WHERE event_id = $1", [
        eventId,
      ])
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
        return res.status(404).json({ message: "Evento não existe", type: "error" });
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
      checkForUser = await pool.query("SELECT * from users WHERE user_id = $1", [userId]);
      userAge = dayjs().diff(checkForUser.rows[0].user_birth_date, "years");

      // Checking if user is already registered
      if (checkForRegistration.rows[0]) {
        const registration = checkForRegistration.rows[0];

        if (registration.registration_status === "completed")
          return res.status(200).json({ message: "Inscrito!", type: "error" });
        if (registration.registration_status === "pending")
          return res.status(200).json({ message: "Inscrição Pendente", type: "alert" });
      }
      const gender = checkForUser.rows[0].user_gender === "Masculino" ? "masc" : "fem";

      const listOfCategories = await pool.query(
        "SELECT * FROM event_categories WHERE (event_id = $1) AND (category_minage <= $2) AND (category_maxage >= $2) AND (category_gender = $3 OR category_gender = 'unisex') ORDER BY category_maxage ASC",
        [id, userAge, gender]
      );

      if (!listOfCategories.rows[0]) {
        return res.status(200).json({
          message: "Esse evento não tem nenhuma categoria disponível para você.",
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
        if (verifyAvailability.rows.length >= validateCoupon.rows[0].coupon_uses) {
          return res.status(200).json({ message: "Cupom Esgotado.", type: "error" });
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
    const registrationEnds = dayjs(checkForAvailability.rows[0].event_registrations_end);
    const maxAttendees = checkForAvailability.rows[0].event_general_attendees;
    const fetchAttendees = await pool.query(
      "SELECT event_id, COUNT(*) as num_attendees FROM registrations WHERE coupon_id IS NULL AND event_id = $1 AND registration_status = $2 GROUP BY event_id",
      [id, "completed"]
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
      return res.status(200).json({ message: "Inscrições Indisponíveis", type: "error" });
    }

    // Checking for number of registrations
    if (currentAttendees >= maxAttendees) {
      return res.status(200).json({ message: "Inscrições Esgotadas", type: "error" });
    }

    // Checking for registration period
    if (dayjs().isBefore(dayjs(registrationStarts))) {
      return res.status(200).json({ message: "Inscrições Em Breve", type: "error" });
    }

    // Checking for registration period
    if (!periodVerification) {
      return res.status(200).json({ message: "Inscrições Encerradas", type: "error" });
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
        .json({ message: "Esta inscrição não foi paga.", type: "error" });
    }

    return res.status(200).json({ data: verifyRegistration.rows[0], type: "success" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao buscar inscrição", type: "error" });
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
        .json({ message: "Erro ao encontrar inscrição.", type: "error" });
    }

    if (verifyRegistration.rows[0].registration_status !== "completed") {
      console.log({
        message: "Esta inscrição não foi paga.",
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
    res.status(400).json({ message: "Erro ao buscar inscrição", type: "error" });
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
  update_registration_payment,
  delete_registration,
  delete_registration_admin,
  check_registration,
  verify_registration,
  checkin_registration,
  list_event_registrations,
  verify_registration_status,
};
