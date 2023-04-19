const fs = require("fs");
const path = require("path");
const pool = require("../database/database");
const { uploadFileToS3, deleteFileFromS3 } = require("../apis/awsS3");

async function create_news(req, res) {
  try {
    const { title, subtitle, body, category } = req.body;
    const user = req.userId;
    const S3Image = await uploadFileToS3(req.file, process.env.S3_BUCKET_NAME, "news-main");
    const link = req.body.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 20)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let date, updateDate;
    date = updateDate = new Date();
    const newNews = await pool.query(
      "INSERT INTO news (news_link, news_title, news_subtitle, news_image_link, news_date, news_last_update, user_id, news_text, news_category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [link, title, subtitle, S3Image, date, updateDate, user, body, category]
    );

    if (req.file) {
      const filePath = path.join(req.file.destination, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({ message: "Notícia criada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao criar notícia. ${err.message}`,
      type: "error",
    });
  }
}

async function list_news_admin(req, res) {
  try {
    const listOfNews = await pool.query("SELECT * FROM news ORDER BY news_date DESC");
    res.json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
}

async function list_news_public(req, res) {
  const { category } = req.params;
  try {
    let listOfNews;
    if (category !== "undefined") {
      listOfNews = await pool.query(`SELECT * FROM news WHERE news_status = $1 AND news_category = $2 ORDER BY news_date DESC LIMIT 4`, [
        true,
        category,
      ]);
    } else {
      listOfNews = await pool.query(`SELECT * FROM news WHERE news_status = $1 ORDER BY news_date DESC LIMIT 4`, [true]);
    }
    res.json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
}

async function list_all_news_public(req, res) {
  try {
    const listOfNews = await pool.query("SELECT * FROM news WHERE news_status = $1 ORDER BY news_date DESC", [true]);
    res.status(200).json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
}

async function list_categories(req, res) {
  try {
    const news = await pool.query("SELECT * FROM news_categories");
    if (news.rows[0]) {
      res.status(200).json(news.rows);
    } else {
      res.status(400).json({ message: "Nenhuma categoria encontrada", type: "error" });
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function publish_unpublish_news(req, res) {
  try {
    const { id, boolean } = req.params;
    const toggleNews = await pool.query("UPDATE news SET news_status = $1 WHERE news_id = $2", [boolean, id]);
    const message = Number(boolean) ? "Notícia publicada." : "Notícia despublicada.";

    res.status(200).json({ message: message, type: "success" });
  } catch (err) {
    res.status(400).json({
      message: `Erro ao processar notícia. ${err.message}`,
      type: "error",
    });
    console.log(err.message);
  }
}

async function fetch_specific_news(req, res) {
  const { id } = req.params;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const isUUID = uuidRegex.test(id);
  try {
    const news = await pool.query(`SELECT * FROM news WHERE news_${isUUID ? "id" : "link"} = $1`, [id]);
    if (news.rows[0]) {
      res.status(200).json(news.rows[0]);
    } else {
      res.status(400).json({ message: "Notícia não encontrada.", type: "error" });
    }
  } catch (err) {
    res.status(400).json({ message: "Notícia não encontrada.", type: "error" });
    console.log(err.message);
  }
}

async function update_news(req, res) {
  try {
    const { id } = req.params;
    const { title, subtitle, body, imageOld } = req.body;

    const image = req.file ? await uploadFileToS3(req.file, process.env.S3_BUCKET_NAME, "news-main") : imageOld;

    if (req.file && imageOld) {
      deleteS3Image = await deleteFileFromS3(process.env.S3_BUCKET_NAME, "news-main", imageOld.split("/").pop());
    }

    const updateDate = new Date();

    const updateNews = await pool.query(
      `UPDATE news SET news_title = $1, news_subtitle = $2, news_text = $3, news_last_update = $4, news_image_link = $5 WHERE news_id = $6`,
      [title, subtitle, body, updateDate, image, id]
    );

    res.status(200).json({ message: "Notícia atualizada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao atualizar a notícia. ${err.message}`,
      type: "error",
    });
  }
}

async function delete_news(req, res) {
  try {
    const { id } = req.params;

    const deleteNews = await pool.query(`DELETE FROM news WHERE news_id = $1 RETURNING news_image_link`, [id]);
    const image = deleteNews.rows[0].news_image_link;
    const deleteS3Image = await deleteFileFromS3(process.env.S3_BUCKET_NAME, "news-main", image.split("/").pop());

    res.status(200).json({ message: "Notícia removida com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao remover a notícia. ${err.message}`,
      type: "error",
    });
  }
}

module.exports = {
  create_news,
  list_news_admin,
  list_news_public,
  list_all_news_public,
  list_categories,
  publish_unpublish_news,
  fetch_specific_news,
  update_news,
  delete_news,
};
