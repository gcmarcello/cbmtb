const pool = require("../database/database");
const Email = require("../utils/emails");

async function list_tickets(req, res) {
  try {
    const listTickets = (await pool.query(`SELECT * FROM tickets`)).rows;
    res
      .status(200)
      .json({
        message: "Chamados encontrados com sucesso.",
        type: "success",
        data: listTickets,
      });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao encontrar chamado", type: "error" });
  }
}

async function fetch_ticket(req, res) {
  try {
    const { id } = req.params;

    const ticket = (
      await pool.query(`SELECT * FROM tickets WHERE ticket_id = $1`, [id])
    ).rows[0];
    res
      .status(200)
      .json({
        message: "Categoria criada com sucesso!",
        type: "success",
        data: ticket,
      });
  } catch (err) {
    console.log(err.message);
  }
}

async function answer_ticket(req, res) {
  try {
    const { id } = req.params;
    const { messageBody, firstName, email } = req.body;

    const sgEmail = new Email([email]);
    sgEmail.sendTicketEmail(firstName, messageBody, id);

    const ticket = await pool.query(
      `UPDATE tickets SET ticket_status = $1 WHERE ticket_id = $2`,
      ["completed", id]
    );
    res
      .status(200)
      .json({ message: "Chamado respondido com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({
        message: `Erro ao responder chamado. ${err.message}`,
        type: "error",
      });
  }
}

module.exports = { list_tickets, fetch_ticket, answer_ticket };
