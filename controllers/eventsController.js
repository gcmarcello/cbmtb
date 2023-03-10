const pool = require("../database");
const { uploadFileToS3 } = require("../apis/awsS3");

const fs = require("fs");
const path = require("path");

async function listEventsAdmin(req, res) {
  try {
    const listOfEvents = await pool.query("SELECT * FROM events ORDER BY event_date_start ASC");
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
    console.log(req.body);
    console.log(req.file);

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
    res.status(200).json(`${boolean ? "Inscrições abertas!" : "Inscrições fechadas."}`);
  } catch (err) {
    console.log(err.message);
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { name, location, date, price, attendees, description, rules, details, categories, link, base64Image } = req.body;
    let S3Image;

    if (base64Image) {
      S3Image = await uploadFileToS3(base64Image, "cbmtb", "event-main");
      const updateImage = await pool.query(`UPDATE events SET event_image = $1 WHERE event_id = $2`, [S3Image, id]);
    }

    const updateEvent = await pool.query(
      `UPDATE events SET event_name = $1, event_location = $2, event_date = $3, event_price = $4, event_max_attendees = $5, event_description = $6, event_rules = $7, event_details = $8, event_link = $10 WHERE event_id = $9`,
      [name, location, date, price, attendees, description, rules, details, id, link]
    );

    const categoriesSQL = categories
      .map((category) => `('${id}',${category.category_name},${category.category_minage},${category.category_maxage})`)
      .join(",");

    categories.forEach(async (category) => {
      await pool.query("UPDATE event_categories SET category_name = $1, category_minage = $2, category_maxage = $3 WHERE category_id = $4", [
        category.category_name,
        category.category_minage,
        category.category_maxage,
        category.category_id,
      ]);
    });
    res.status(200).json({ message: "Evento atualizado com sucesso!", type: "success" });
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar o evento.", type: "error" });
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

module.exports = { listEventsAdmin, listEventsPublic, readEventPage, createEvent, toggleRegistrations, updateEvent, deleteEvent };
