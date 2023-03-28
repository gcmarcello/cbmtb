const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

async function uploadFileToS3(file, bucketName, folder, ACL) {
  const format = file.originalname.split(".").pop();
  const allowedFormats = ["jpeg", "jpg", "png", "gif", "webp", "pdf"];
  const buffer = fs.createReadStream(path.join("uploads/", file.filename));
  const key = crypto.randomBytes(16).toString("hex");

  if (allowedFormats.indexOf(format) < 0) {
    return { message: "Formato de arquivo não suportado.", type: "error" };
  }

  const params = {
    Bucket: bucketName,
    Key: `${process.env.NODE_ENV === "production" ? "" : "dev-folder/"}${folder}/${key}.${format.split("/").pop()}`,
    Body: buffer,
    ContentType: format === "pdf" ? "application/pdf" : format,
    ACL: ACL || "public-read",
  };

  const fileLink = s3
    .upload(params)
    .promise()
    .then((data) => {
      return data.Location;
    })
    .catch((err) => {
      console.log(err);
    });

  return fileLink;
}

async function deleteFileFromS3(bucketName, folder, file) {
  const params = {
    Bucket: bucketName,
    Key: `${folder}/${file}`,
  };

  const deleteFile = s3
    .deleteObject(params)
    .promise()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createPreSignedURL(bucketName, folder, file) {
  var params = { Bucket: bucketName, Key: `${process.env.NODE_ENV === "production" ? "" : "dev-folder/"}${folder}/${file}`, Expires: 60 };
  var url = s3.getSignedUrl("getObject", params);
  return url;
}

module.exports = { uploadFileToS3, deleteFileFromS3, createPreSignedURL };
