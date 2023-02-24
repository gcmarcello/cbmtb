const AWS = require("aws-sdk");
const fs = require("fs");
const crypto = require("crypto");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

async function uploadFileToS3(file, bucketName, folder, ACL) {
  const format = file.split(";").shift().split(":").pop();
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"];
  console.log(file.replace(/^data:(image\/\w+|application\/pdf);base64,/, ""));
  const buffer = Buffer.from(file.replace(/^data:(image\/\w+|application\/pdf);base64,/, ""), "base64");
  const key = crypto.randomBytes(16).toString("hex");

  if (allowedFormats.indexOf(format) < 0) {
    return { message: "Formato de arquivo não suportado.", type: "error" };
  }

  const params = {
    Bucket: bucketName,
    Key: `${folder}/${key}.${format.split("/").pop()}`,
    Body: buffer,
    ContentType: format,
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
  var params = { Bucket: bucketName, Key: `${folder}/${file}`, Expires: 60 };
  var url = s3.getSignedUrl("getObject", params);
  return url;
}

module.exports = { uploadFileToS3, deleteFileFromS3, createPreSignedURL };
