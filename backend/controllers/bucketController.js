const {
  uploadFileToS3,
  deleteFileFromS3,
  createPreSignedURL,
} = require("../apis/awsS3");
const fs = require("fs");
const path = require("path");

async function upload_file(req, res) {
  const url = await uploadFileToS3(
    req.file,
    process.env.MAIN_BUCKET_NAME,
    "public"
  );

  if (req.file) {
    const filePath = path.join(req.file.destination, req.file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  res.status(200).json(url);
}

module.exports = { upload_file };
