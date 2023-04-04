const pool = require("../database");
const {
  uploadFileToS3,
  deleteFileFromS3,
  createPreSignedURL,
} = require("../apis/awsS3");

const fs = require("fs");
const path = require("path");

async function read_document(req, res) {
  try {
    const { id } = req.params;
    const link = createPreSignedURL(
      process.env.MAIN_BUCKET_NAME,
      "documents",
      `${id}`
    );
    return res.status(200).json(link);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Erro. ${err.message}`, type: "error" });
  }
}

async function list_documents(req, res) {
  try {
    const documentsList = await pool.query(
      "SELECT * FROM documents ORDER BY document_year DESC"
    );
    return res.status(200).json(documentsList.rows);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Erro. ${err.message}`, type: "error" });
  }
}

async function create_document(req, res) {
  try {
    const userId = req.userId;
    const { title, description, year, general } = req.body;

    const s3File = await uploadFileToS3(
      req.file,
      process.env.MAIN_BUCKET_NAME,
      "documents",
      "private"
    );

    const newDocument = await pool.query(
      "INSERT INTO documents (document_title, document_description, document_year, document_general, user_id, document_link) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [title, description, +year, general, userId, s3File]
    );

    if (req.file) {
      const filePath = path.join(req.file.destination, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    return res
      .status(200)
      .json({ message: "Documento foi enviado com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: `Erro ao enviar o documento. ${err.message}`,
      type: "error",
    });
  }
}

async function delete_document(req, res) {
  try {
    const { id } = req.params;
    const deleteDocument = await pool.query(
      "DELETE FROM documents WHERE document_id = $1 RETURNING *",
      [id]
    );

    const deleteDocumentLink = deleteDocument.rows[0].document_link;

    const deleteS3File = await deleteFileFromS3(
      process.env.MAIN_BUCKET_NAME,
      "documents",
      deleteDocumentLink.split("/").pop()
    );

    return res.status(200).json({
      message: "Documento foi removido com sucesso!",
      type: "success",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: `Erro ao remover o documento. ${err.message}`,
      type: "error",
    });
  }
}

module.exports = {
  read_document,
  list_documents,
  create_document,
  delete_document,
};
