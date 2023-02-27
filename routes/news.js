const router = require("express").Router();
const pool = require("../database");
const adminAuthorization = require("./middlewares/adminAuthorization");
const { uploadFileToS3, deleteFileFromS3 } = require("../apis/awsS3");

// Create News (ADMIN)
router.post("/", adminAuthorization, async (req, res) => {
  try {
    const { title, base64Image, subtitle, text } = req.body;
    const user = req.userId;
    const S3Image = await uploadFileToS3(base64Image, "cbmtb", "news-main");
    const link = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .slice(0, 20)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let date, updateDate;
    date = updateDate = new Date();
    const newNews = await pool.query(
      "INSERT INTO news (news_link, news_title, news_subtitle, news_image_link, news_date, news_last_update, user_id, news_text) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [link, title, subtitle, S3Image, date, updateDate, user, text]
    );

    res.status(200).json({ message: "Notícia criada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: `Erro ao criar notícia. ${err.message}`, type: "error" });
  }
});

// List News (ADMIN)
router.get("/", adminAuthorization, async (req, res) => {
  try {
    const listOfNews = await pool.query("SELECT * FROM news ORDER BY news_date DESC");
    res.json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
});

// List News (PUBLIC)
router.get("/public/", async (req, res) => {
  try {
    const listOfNews = await pool.query("SELECT * FROM news WHERE news_status = $1 ORDER BY news_date DESC LIMIT 4", [true]);
    res.json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
});

// List All News (PUBLIC)
router.get("/public/all", async (req, res) => {
  try {
    const listOfNews = await pool.query("SELECT * FROM news WHERE news_status = $1 ORDER BY news_date DESC", [true]);
    res.status(200).json(listOfNews.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
});

// List Categories
router.get("/categories", adminAuthorization, async (req, res) => {
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
});

// Publish/Unpublish News (ADMIN)
router.put("/toggle/:id/:boolean", adminAuthorization, async (req, res) => {
  try {
    const { id, boolean } = req.params;
    const toggleNews = await pool.query("UPDATE news SET news_status = $1 WHERE news_id = $2", [boolean, id]);
    const message = Number(boolean) ? "Notícia publicada." : "Notícia despublicada.";

    res.status(200).json({ message: message, type: "success" });
  } catch (err) {
    res.status(400).json({ message: `Erro ao processar notícia. ${err.message}`, type: "error" });
    console.log(err.message);
  }
});

// Fetch Specific News (PUBLIC)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const news = await pool.query("SELECT * FROM news WHERE news_link = $1", [id]);
    if (news.rows[0]) {
      res.status(200).json(news.rows[0]);
    } else {
      res.status(400).json({ message: "Notícia não encontrada.", type: "error" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

// Update News (ADMIN)
router.put("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, base64Image, newsBody, image } = req.body;
    let S3Image = null;

    if (base64Image) {
      S3Image = await uploadFileToS3(base64Image, "cbmtb", "news-main");
      if (S3Image.type === "error") {
        return res.status(400).json({ message: S3Image.message, type: S3Image.type });
      }
      deleteS3Image = await deleteFileFromS3("cbmtb", "news-main", image.split("/").pop());
    }

    const updateDate = new Date();

    const updateNews = await pool.query(
      `UPDATE news SET news_title = $1, news_subtitle = $2, news_text = $3, news_last_update = $4, news_image_link = COALESCE($5, news_image_link) WHERE news_id = $6`,
      [title, subtitle, newsBody, updateDate, S3Image, id]
    );

    res.status(200).json({ message: "Notícia atualizada com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: `Erro ao atualizar a notícia. ${err.message}`, type: "error" });
  }
});

// Delete News
router.delete("/:id", adminAuthorization, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteNews = await pool.query(`DELETE FROM news WHERE news_id = $1 RETURNING news_image_link`, [id]);
    const image = deleteNews.rows[0].news_image_link;
    const deleteS3Image = await deleteFileFromS3("cbmtb", "news-main", image.split("/").pop());

    res.status(200).json({ message: "Notícia removida com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: `Erro ao remover a notícia. ${err.message}`, type: "error" });
  }
});

module.exports = router;
