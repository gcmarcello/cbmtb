const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");

const { uploadFileToS3 } = require("../apis/awsS3");

// List Events (ADMIN)
router.get("/", adminAuthorization, async (req, res) => {
  try {
    const listOfEvents = await pool.query("SELECT * FROM events ORDER BY event_date ASC");
    res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// List Events (PUBLIC)
router.get("/public/", async (req, res) => {
  try {
    const listOfEvents = await pool.query("SELECT * FROM events WHERE event_status = $1 ORDER BY event_date ASC", [true]);
    res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// View Event (PUBLIC)
router.get("/:id", async (req, res) => {
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
});

// Create Event (ADMIN)
router.post("/", adminAuthorization, async (req, res) => {
  try {
    const { name, location, link, base64Image, price, date, attendees, description, rules, details, categories } = req.body;

    const S3Image = await uploadFileToS3(base64Image, "cbmtb", "event-main");

    const newEvent = await pool.query(
      "INSERT INTO events (event_name, event_location, event_link, event_image, event_price, event_date, event_max_attendees, event_current_attendees, event_description, event_rules, event_details, event_owner_id, event_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)  RETURNING *",
      [name, location, link, S3Image, Number(price), date, Number(attendees), 0, description, rules, details, req.userId, false]
    );

    const newEventID = newEvent.rows[0].event_id;

    const categoriesSQL = categories
      .map((category) => `('${newEventID}','${category.name}','${category.minAge}','${category.maxAge}', '${category.gender}')`)
      .join(",");
    const newCategories = await pool.query(
      `INSERT INTO categories (event_id,category_name,category_minage,category_maxage,category_gender) VALUES ${categoriesSQL}`
    );

    res.status(200).json({ message: "Evento criado com sucesso!", data: newEvent.rows[0] });
  } catch (err) {
    console.log(err.message);
  }
});

// Open/Close Event (ADMIN)
router.put("/toggle/:id/:boolean", adminAuthorization, async (req, res) => {
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
});

// Update Event (ADMIN)
router.put("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, date, price, attendees, description, rules, details, categories, base64Image } = req.body;
    let S3Image;

    if (base64Image) {
      S3Image = await uploadFileToS3(base64Image, "cbmtb", "event-main");
    }

    const updateEvent = await pool.query(
      `UPDATE events SET event_name = $1, event_location = $2, event_date = $3, event_price = $4, event_max_attendees = $5, event_description = $6, event_rules = $7, event_details = $8, event_image = ${
        S3Image ? S3Image : "event_image"
      } WHERE event_id = $9`,
      [name, location, date, price, attendees, description, rules, details, id]
    );
    const categoriesSQL = categories
      .map((category) => `('${id}',${category.category_name},${category.category_minage},${category.category_maxage})`)
      .join(",");

    categories.forEach(async (category) => {
      await pool.query("UPDATE categories SET category_name = $1, category_minage = $2, category_maxage = $3 WHERE category_id = $4", [
        category.category_name,
        category.category_minage,
        category.category_maxage,
        category.category_id,
      ]);
    });
    res.status(200).json({ message: "Evento atualizado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Erro ao atualizar o evento.", type: "error" });
  }
});

// Delete Event (ADMIN)
router.delete("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEvent = await pool.query("DELETE FROM events WHERE event_id = $1", [id]);
    res.status(200).json({ message: "Evento removido com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Evento ao remover o evento!", type: "error" });
  }
});

module.exports = router;
