const pool = require("../database/database");
const { uploadFileToS3, listFilesInFolder } = require("../apis/awsS3");

const fs = require("fs");
const path = require("path");

const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const __config = require("../_config");

async function listEventsAdmin(req, res) {
  try {
    const listOfEvents = await pool.query(
      "SELECT event_id,event_name, event_date_start, event_status, event_general_attendees FROM events ORDER BY event_date_start DESC"
    );
    res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function listNextEvents(req, res) {
  let listOfEvents;
  try {
    listOfEvents = await pool.query(
      "SELECT * FROM events WHERE event_status = $1 ORDER BY event_date_start DESC",
      ["open"]
    );

    const checkForAvailability = (
      registrationStartDate,
      registrationEndDate
    ) => {
      const registrationStarts = dayjs(registrationStartDate);
      const registrationEnds = dayjs(registrationEndDate);
      return dayjs().isBetween(registrationStarts, registrationEnds, null, []);
    };

    return res.json(
      listOfEvents.rows.filter((event) =>
        checkForAvailability(
          event.event_registrations_start,
          event.event_registrations_end
        )
      )
    );
  } catch (err) {
    console.log(err.message);
  }
}

async function listEventsPublic(req, res) {
  try {
    const { event, home } = req.params;

    const listOfEvents = await pool.query(
      "SELECT * FROM events WHERE event_status <> $1 ORDER BY event_date_start DESC",
      ["private"]
    );

    const checkForAvailability = (
      registrationStartDate,
      registrationEndDate
    ) => {
      const registrationStarts = dayjs(registrationStartDate);
      const registrationEnds = dayjs(registrationEndDate);
      return dayjs().isBetween(registrationStarts, registrationEnds, null, []);
    };

    return res.json(listOfEvents.rows);
  } catch (err) {
    console.log(err.message);
  }
}

async function readEventPage(req, res) {
  try {
    const { id } = req.params;
    const typeOfLink =
      /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(
        id
      );
    const eventInfo = typeOfLink
      ? await pool.query("SELECT * FROM events WHERE event_id = $1", [id])
      : await pool.query("SELECT * FROM events WHERE event_link = $1", [id]);
    if (eventInfo.rows[0]) {
      const categories = (
        await pool.query("SELECT * FROM event_categories WHERE event_id = $1", [
          eventInfo.rows[0].event_id,
        ])
      ).rows;
      const media = !!(
        await pool.query("SELECT * FROM event_records WHERE event_id = $1", [
          eventInfo.rows[0].event_id,
        ])
      ).rows[0];
      res.status(200).json({ ...eventInfo.rows[0], categories, media });
    } else {
      res
        .status(404)
        .json({ message: "Evento não encontrado!", type: "error" });
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function createEvent(req, res) {
  try {
    const {
      name,
      location,
      link,
      external,
      attendees,
      dateStart,
      dateEnd,
      registrationStart,
      registrationEnd,
      description,
      rules,
      details,
    } = req.body;

    const categories = JSON.parse(req.body.categories);

    const S3Image = await uploadFileToS3(
      req.file,
      process.env.S3_BUCKET_NAME,
      "event-main"
    );

    const newEvent = await pool.query(
      "INSERT INTO events (event_name, event_location, event_link, event_external, event_image, event_general_attendees, event_owner_id, event_status, event_date_start, event_date_end, event_registrations_start, event_registrations_end, event_description, event_rules, event_details) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)  RETURNING *",
      [
        name,
        location,
        link,
        external !== "undefined" ? external : null,
        S3Image,
        attendees,
        req.userId,
        "private",
        dayjs(dateStart).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(dateEnd).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(registrationStart).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(registrationEnd).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        description,
        rules,
        details,
      ]
    );

    const newEventID = newEvent.rows[0].event_id;

    if (categories.length) {
      const categoriesSQL = categories
        .map(
          (category) =>
            `('${newEventID}','${category.name}','${category.minAge}','${category.maxAge}', '${category.gender}', '${category.price}')`
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

    res
      .status(200)
      .json({ message: "Evento criado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
  }
}

async function toggleRegistrations(req, res) {
  try {
    const { id, status } = req.params;
    const toggleEvent = await pool.query(
      "UPDATE events SET event_status = $1 WHERE event_id = $2 AND event_owner_id = $3 RETURNING *",
      [status, id, req.userId]
    );
    res.status(200).json({
      message: "Status do Evento Atualizado!",
      type: "success",
    });
  } catch (err) {
    res.status(400).json({
      message: `Erro ao atualizar evento. ${err.message}`,
      type: "error",
    });
    console.log(err.message);
  }
}

async function retrieveEventInformation(req, res) {
  try {
    const { id } = req.params;
    const event = (
      await pool.query("SELECT * FROM events WHERE event_id = $1", [id])
    ).rows[0];
    const categories = (
      await pool.query("SELECT * FROM event_categories WHERE event_id = $1", [
        id,
      ])
    ).rows;
    const coupons = (
      await pool.query("SELECT * FROM event_coupons WHERE event_id = $1", [id])
    ).rows;
    const registrations = (
      await pool.query(
        "SELECT r.registration_id,r.registration_checkin,r.registration_shirt,r.registration_status,r.registration_date, r.coupon_id, u.user_email,u.user_first_name,u.user_last_name,u.user_cpf, u.user_phone, u.user_birth_date, c.category_id, c.category_name, ec.coupon_link FROM registrations AS r LEFT JOIN users AS u ON r.user_id = u.user_id LEFT JOIN event_categories AS c ON r.category_id = c.category_id LEFT JOIN event_coupons AS ec ON r.coupon_id = ec.coupon_id WHERE r.event_id = $1",
        [id]
      )
    ).rows;
    res.status(200).json({ ...event, categories, coupons, registrations });
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erro ao encontrar o evento. ${err}`, type: "error" });
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
      flagship,
    } = req.body;

    const image = req.file
      ? await uploadFileToS3(req.file, process.env.S3_BUCKET_NAME, "event-main")
      : imageOld;

    const updateEvent = await pool.query(
      `UPDATE events SET event_link = $1, event_owner_id = $2, event_name= $3, event_location = $4, event_image = $5, event_description = $6, event_rules = $7, event_details = $8, event_general_attendees = $9, event_external = $10, event_date_start = $11, event_date_end = $12, event_registrations_start = $13, event_registrations_end = $14, flagship_id = $16 WHERE event_id = $15`,
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
        dayjs(dateStart).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(dateEnd).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(registrationStart).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        dayjs(registrationEnd).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
        id,
        flagship === "null" ? null : flagship,
      ]
    );

    if (req.body.coupons) {
      const coupons = JSON.parse(req.body.coupons);
      const existingCoupons = coupons.filter((coupon) => coupon.coupon_id);

      if (existingCoupons.length) {
        const existingCouponsSQL = existingCoupons
          .map(
            (coupon) =>
              `('${coupon.coupon_id}'::uuid, '${id}'::uuid, '${coupon.coupon_link}', '${coupon.coupon_uses}'::integer)`
          )
          .join(",");

        const updateExistingCoupons = await pool.query(
          `UPDATE event_coupons AS ec SET
          coupon_id = t.coupon_id,
          coupon_link = t.coupon_link,
          event_id = t.event_id,
          coupon_uses = t.coupon_uses
        FROM (VALUES ${existingCouponsSQL}) AS t(coupon_id, event_id, coupon_link, coupon_uses)
        WHERE t.coupon_id = ec.coupon_id`
        );
      }

      const newCoupons = coupons.filter((coupon) => !coupon.coupon_id);

      if (newCoupons.length) {
        const newCouponsSQL = coupons
          .filter((coupon) => coupon.coupon_id.length < 1)
          .map(
            (coupon) =>
              `('${id}'::uuid, '${coupon.coupon_link}', '${coupon.coupon_uses}'::integer)`
          )
          .join(",");

        const createNewCoupons = await pool.query(
          `INSERT INTO event_coupons (event_id,coupon_link,coupon_uses) VALUES ${newCouponsSQL}`
        );
      }
    }

    const existingCategories = categories.filter(
      (category) => category.category_id
    );

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

    const newCategories = categories.filter(
      (category) => !category.category_id
    );

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

    res
      .status(200)
      .json({ message: "Evento atualizado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao atualizar o evento. ${err.message}`,
      type: "error",
    });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const deleteEvent = await pool.query(
      "DELETE FROM events WHERE event_id = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: "Evento removido com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Evento ao remover o evento!", type: "error" });
  }
}

async function listFlagships(req, res) {
  try {
    const flagship = await pool.query("SELECT * FROM flagships");
    res.status(200).json({ data: flagship.rows, type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao encontrar os eventos.", type: "error" });
  }
}

async function listEventMedias(req, res) {
  try {
    const { id } = req.params;
    const bucket = await pool.query(
      "SELECT record_bucket, event_name, event_link FROM event_records LEFT JOIN events ON event_records.event_id = events.event_id WHERE event_records.event_id = $1",
      [id]
    );
    if (!bucket.rows[0].record_bucket) {
      res
        .status(400)
        .json({ message: "Erro ao encontrar as mídias.", type: "error" });
    }
    const files = await listFilesInFolder(
      __config.entidade.abbreviation.toLowerCase(),
      `events/${bucket.rows[0].record_bucket}`
    );
    res.status(200).json({
      event: {
        name: bucket.rows[0].event_name,
        link: bucket.rows[0].event_link,
      },
      data: files,
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao encontrar os eventos.", type: "error" });
  }
}

async function listFlagshipEvents(req, res) {
  try {
    const { id, widget } = req.params;
    const flagship = await pool.query(
      `SELECT event_id, event_link, event_name, event_location, event_image, event_date_start FROM events WHERE flagship_id = $1 ORDER BY event_date_start DESC ${
        widget && "LIMIT 4"
      }`,
      [id]
    );
    res.status(200).json({ data: flagship.rows, type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao encontrar os eventos.", type: "error" });
  }
}

async function fetchFlagship(req, res) {
  try {
    const { id } = req.params;
    const typeOfLink =
      /^\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b$/.test(
        id
      );
    const flagship = typeOfLink
      ? await pool.query("SELECT * FROM flagships WHERE flagship_id = $1", [id])
      : await pool.query("SELECT * FROM flagships WHERE flagship_link = $1", [
          id,
        ]);
    if (!flagship.rows.length) {
      return res
        .status(404)
        .json({ message: "Erro ao encontrar o evento", type: "error" });
    }

    res.status(200).json({ data: flagship.rows[0], type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao encontrar evento.", type: "error" });
  }
}

async function updateFlagship(req, res) {
  try {
    const { id } = req.params;
    const { name, link, flagshipOldBG, flagshipOldLogo } = req.body;

    const logo = req.files.logo
      ? await uploadFileToS3(
          req.files.logo[0],
          process.env.S3_BUCKET_NAME,
          "flagship-logos"
        )
      : flagshipOldLogo;
    const bg = req.files.bg
      ? await uploadFileToS3(
          req.files.bg[0],
          process.env.S3_BUCKET_NAME,
          "flagship-bgs"
        )
      : flagshipOldBG;

    const updateFlagship = await pool.query(
      "UPDATE flagships SET flagship_name = $1, flagship_link = $2, flagship_logo = $3, flagship_bg = $4 WHERE flagship_id = $5",
      [name, link, logo, bg, id]
    );

    if (req.files) {
      const fileKeys = Object.keys(req.files);

      fileKeys.forEach((key) => {
        const file = req.files[key][0];
        const filePath = path.join(file.destination, file.filename);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    }

    res
      .status(200)
      .json({ message: "Série atualizada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao atualizar evento.", type: "error" });
  }
}

async function createFlagship(req, res) {
  try {
    const { id } = req.params;
    const { name, link } = req.body;

    const logo = await uploadFileToS3(
      req.files.logo[0],
      process.env.S3_BUCKET_NAME,
      "flagship-logos"
    );
    const bg = await uploadFileToS3(
      req.files.bg[0],
      process.env.S3_BUCKET_NAME,
      "flagship-bgs"
    );

    const createFlagship = await pool.query(
      "INSERT INTO flagships (flagship_name,flagship_link,flagship_logo,flagship_bg) VALUES ($1,$2,$3,$4)",
      [name, link, logo, bg]
    );

    if (req.files) {
      const fileKeys = Object.keys(req.files);

      fileKeys.forEach((key) => {
        const file = req.files[key][0];
        const filePath = path.join(file.destination, file.filename);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    }

    res
      .status(200)
      .json({ message: "Série atualizada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao atualizar evento.", type: "error" });
  }
}

async function completeEvent(req, res) {
  try {
    const { id } = req.params;
    const suspendedUsers = req.body.filter((user) => user.suspended);
    const userIds = suspendedUsers.map((user) => user.user_id);
    const suspendUsers = pool.query(
      `UPDATE users SET user_confirmed = false, user_email = null WHERE user_id = ANY($1::uuid[])`,
      [userIds]
    );
    const completeEvent = pool.query(
      `UPDATE events SET event_status = 'completed' WHERE event_id = $1`,
      [id]
    );
    res
      .status(200)
      .json({ message: "Evento finalizado com sucesso.", type: "success" });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Erro ao finalizar evento.", type: "error" });
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
  listNextEvents,
  listFlagships,
  fetchFlagship,
  updateFlagship,
  listFlagshipEvents,
  createFlagship,
  listEventMedias,
  completeEvent,
};
