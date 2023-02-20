const AWS = require("aws-sdk");
const fs = require("fs");
const crypto = require("crypto");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

async function uploadFileToS3(file, bucketName) {
  const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const key = crypto.randomBytes(16).toString("hex");

  const params = {
    Bucket: bucketName,
    Key: `${key}.png`,
    Body: buffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  const imageLink = s3
    .upload(params)
    .promise()
    .then((data) => {
      return data.Location;
    })
    .catch((err) => {
      console.log(err);
    });

  return imageLink;
}

module.exports = { uploadFileToS3 };
