const pool = require("../database");
const { uploadFileToS3 } = require("../apis/awsS3");

const fs = require("fs");
const path = require("path");

async function listEventsAdmin(req, res) {
  try {
    const listOfEvents = await pool.query(
      "SELECT event_id,event_name, event_date_start, event_status, event_current_attendees, event_max_attendees FROM events ORDER BY event_date_start ASC"
    );
    res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function listEventsPublic(req, res) {
  try {
    const listOfEvents = await pool.query("SELECT * FROM events WHERE event_status = $1 ORDER BY event_date_start ASC", [true]);
    res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function readEventPage(req, res) {
  try {
    const { id } = req.params;
    const typeOfLink = /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(id);
    const eventInfo = typeOfLink
      ? await pool.query("SELECT * FROM events WHERE event_id = $1", [id])
      : await pool.query("SELECT * FROM events WHERE event_link = $1", [id]);
    if (eventInfo.rows[0]) {
      res.json(eventInfo.rows[0]);
    } else {
      res.json("Evento não encontrado!");
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function createEvent(req, res) {
  try {
    const { name, location, link, external, attendees, dateStart, dateEnd, registrationStart, registrationEnd, description, rules, details } =
      req.body;

    const categories = JSON.parse(req.body.categories);

    const S3Image = await uploadFileToS3(req.file, "cbmtb", "event-main");

    const newEvent = await pool.query(
      "INSERT INTO events (event_name, event_location, event_link, event_external, event_image, event_max_attendees, event_current_attendees, event_owner_id, event_status, event_date_start, event_date_end, event_registrations_start, event_registrations_end, event_description, event_rules, event_details) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)  RETURNING *",
      [
        name,
        location,
        link,
        external !== "undefined" ? external : null,
        S3Image,
        attendees,
        0,
        req.userId,
        false,
        dateStart,
        dateEnd,
        registrationStart,
        registrationEnd,
        description,
        rules,
        details,
      ]
    );

    const newEventID = newEvent.rows[0].event_id;

    if (categories.length) {
      const categoriesSQL = categories
        .map(
          (category) => `('${newEventID}','${category.name}','${category.minAge}','${category.maxAge}', '${category.gender}', '${category.price}')`
        )
        .join(",");
      const newCategories = await pool.query(
        `INSERT INTO event_categories (event_id,category_name,category_minage,category_maxage,category_gender, category_price) VALUES ${categoriesSQL}`
      );
    }

    const filePath = path.join(req.file.destination, req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });

    res.status(200).json({ message: "Evento criado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
}

async function toggleRegistrations(req, res) {
  try {
    const { id, boolean } = req.params;
    const toggleEvent = await pool.query("UPDATE events SET event_status = $1 WHERE event_id = $2 AND event_owner_id = $3", [
      boolean,
      id,
      req.userId,
    ]);
    res.status(200).json({ message: boolean === "true" ? "Inscrições abertas!" : "Inscrições fechadas.", type: "success" });
  } catch (err) {
    res.status(400).json({ message: `Erro ao abrir/fechar inscrições. ${err.message}`, type: "error" });
    console.log(err.message);
  }
}

async function retrieveEventInformation(req, res) {
  try {
    const { id } = req.params;
    const event = (await pool.query("SELECT * FROM events WHERE event_id = $1", [id])).rows[0];
    const categories = (await pool.query("SELECT * FROM event_categories WHERE event_id = $1", [id])).rows;
    const registrations = (
      await pool.query(
        "SELECT r.registration_id,r.registration_shirt,r.registration_status,r.registration_date,u.user_email,u.user_first_name,u.user_last_name,u.user_cpf, u.user_phone, u.user_birth_date,c.category_name FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN event_categories AS c ON r.category_id = c.category_id WHERE r.event_id = $1",
        [id]
      )
    ).rows;
    res.status(200).json({ ...event, categories, registrations });
  } catch (err) {
    res.status(400).json({ message: `Erro ao encontrar o evento. ${err}`, type: "error" });
    console.log(err.message);
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const categories = JSON.parse(req.body.categories);

    const {
      name,
      location,
      link,
      attendees,
      imageOld,
      dateStart,
      dateEnd,
      registrationStart,
      registrationEnd,
      description,
      rules,
      details,
      external,
    } = req.body;

    const image = req.file ? await uploadFileToS3(req.file, "cbmtb", "event-main") : imageOld;

    const updateEvent = await pool.query(
      `UPDATE events SET event_link = $1, event_owner_id = $2, event_name= $3, event_location = $4, event_image = $5, event_description = $6, event_rules = $7, event_details = $8, event_max_attendees = $9, event_external = $10, event_date_start = $11, event_date_end = $12, event_registrations_start = $13, event_registrations_end = $14 WHERE event_id = $15`,
      [
        link,
        req.userId,
        name,
        location,
        image,
        description,
        rules,
        details,
        attendees,
        external === "undefined" ? null : external,
        dateStart,
        dateEnd,
        registrationStart,
        registrationEnd,
        id,
      ]
    );

    const existingCategories = categories.filter((category) => category.category_id);

    if (existingCategories.length) {
      const existingCategoriesSQL = existingCategories
        .map(
          (category) =>
            `('${category.category_id}'::uuid, '${category.category_name}', '${category.category_minAge}'::integer, '${category.category_maxAge}'::integer, '${category.category_gender}', '${category.category_price}'::real)`
        )
        .join(",");

      const updateExistingCategories = await pool.query(
        `UPDATE event_categories AS ec SET
      category_id = t.category_id,
      category_name = t.category_name,
      category_minage = t.category_minage,
      category_maxage = t.category_maxage,
      category_gender = t.category_gender,
      category_price = t.category_price
      FROM (VALUES ${existingCategoriesSQL}) AS t(category_id, category_name, category_minage, category_maxage, category_gender, category_price)
      WHERE t.category_id = ec.category_id`
      );
    }

    const newCategories = categories.filter((category) => !category.category_id);

    if (newCategories.length) {
      const newCategoriesSQL = categories
        .filter((category) => category.category_id.length < 1)
        .map(
          (category) =>
            `('${id}'::uuid,'${category.category_name}','${category.category_minAge}'::integer,'${category.category_maxAge}'::integer, '${category.category_gender}', '${category.category_price}'::real)`
        )
        .join(",");

      const createNewCategories = await pool.query(
        `INSERT INTO event_categories (event_id,category_name,category_minage,category_maxage,category_gender, category_price) VALUES ${newCategoriesSQL}`
      );
    }

    if (req.file) {
      const filePath = path.join(req.file.destination, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({ message: "Evento atualizado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: `Erro ao atualizar o evento. ${err.message}`, type: "error" });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const deleteEvent = await pool.query("DELETE FROM events WHERE event_id = $1", [id]);
    res.status(200).json({ message: "Evento removido com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Evento ao remover o evento!", type: "error" });
  }
}

module.exports = {
  listEventsAdmin,
  listEventsPublic,
  readEventPage,
  createEvent,
  toggleRegistrations,
  updateEvent,
  deleteEvent,
  retrieveEventInformation,
};
