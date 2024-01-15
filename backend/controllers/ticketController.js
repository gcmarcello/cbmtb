const pool = require("../database/database");
const Email = require("../utils/emails");
const dayjs = require("dayjs");

async function list_tickets(req, res) {
  try {
    const listTickets = (await pool.query(`SELECT * FROM tickets`)).rows;
    const ticketMessages = listTickets.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      user_id: ticket.user_id,
      message_body: ticket.ticket_message,
      message_date: dayjs(ticket.ticket_date),
    }));
    const ticketMessagesSQL = ticketMessages
      .map(
        (coupon) =>
          `('${coupon.ticket_id}'::uuid, '${null}', '${coupon.message_body}', '${
            coupon.message_date
          }')`
      )
      .join(",");

    const sqlQuery = `INSERT INTO ticket_messages (ticket_id,user_id,message_body,message_date) VALUES ${ticketMessagesSQL}`;
    res.status(200).json({
      message: "Chamados encontrados com sucesso.",
      type: "success",
      data: listTickets,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Erro ao encontrar chamado", type: "error" });
  }
}

async function fetch_ticket(req, res) {
  try {
    const { id } = req.params;

    const ticket = (await pool.query(`SELECT * FROM tickets WHERE ticket_id = $1`, [id]))
      .rows[0];
    const messages = (
      await pool.query(
        "SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY message_date DESC",
        [id]
      )
    ).rows;

    res.status(200).json({
      message: "Categoria criada com sucesso!",
      type: "success",
      data: { ticket, messages },
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function answer_ticket_admin(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { messageBody } = req.body;

    const response = await pool.query(
      "INSERT INTO ticket_messages (ticket_id,user_id,message_body,message_date) VALUES ($1,$2,$3,$4) RETURNING *",
      [id, userId, messageBody, dayjs()]
    );

    const ticket = await pool.query(
      `UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2 RETURNING *`,
      ["awaiting", id]
    );

    const sgEmail = new Email([ticket.rows[0].ticket_email.split(" ")[0]]);
    await sgEmail.answerTicketEmail(ticket.rows[0].ticket_name.split(" ")[0], id);

    res.status(200).json({
      message: "Chamado respondido com sucesso!",
      type: "success",
      data: response.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao responder chamado. ${err.message}`,
      type: "error",
    });
  }
}

async function answer_ticket_public(req, res) {
  try {
    const { id } = req.params;
    const { messageBody } = req.body;

    const response = await pool.query(
      "INSERT INTO ticket_messages (ticket_id,message_body,message_date) VALUES ($1,$2,$3) RETURNING *",
      [id, messageBody, dayjs()]
    );

    const ticket = await pool.query(
      `UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2 RETURNING *`,
      ["pending", id]
    );

    res.status(200).json({
      message: "Resposta enviada com sucesso. Aguarde nosso contato!",
      type: "success",
      data: response.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao enviar resposta. ${err.message}`,
      type: "error",
    });
  }
}

async function create_ticket(req, res) {
  try {
    const { fullName, email, phone, message } = req.body;

    const newTicket = await pool.query(
      "INSERT INTO tickets (ticket_name,ticket_email,ticket_phone,ticket_status,ticket_date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [fullName, email, phone, "pending", dayjs()]
    );

    const newTicketMessage = await pool.query(
      "INSERT INTO ticket_messages (ticket_id, message_body, message_date) VALUES ($1,$2,$3)",
      [newTicket.rows[0].ticket_id, message, dayjs()]
    );

    res.status(200).json({ message: "Mensagem enviada com sucesso.", type: "success" });
  } catch (err) {
    res.status(400).json({
      message: `Erro ao enviar mensagem. ${err.message}`,
      type: "error",
    });
    console.log(err.message);
  }
}

async function resolve_ticket(req, res) {
  try {
    const { id } = req.params;

    const resolveTicket = await pool.query(
      "UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2",
      ["completed", id]
    );

    res.status(200).json({ message: "Chamado resolvido com sucesso.", type: "success" });
  } catch (err) {
    res.status(400).json({
      message: `Erro resolver chamado. ${err.message}`,
      type: "error",
    });
    console.log(err.message);
  }
}

module.exports = {
  create_ticket,
  list_tickets,
  fetch_ticket,
  answer_ticket_admin,
  answer_ticket_public,
  resolve_ticket,
};
