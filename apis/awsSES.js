const AWS = require("aws-sdk");

const sesV2 = new AWS.SESV2({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

async function listVerifiedEmails() {
  const emailList = sesV2
    .listEmailIdentities()
    .promise()
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  return emailList;
}

async function sendEmail() {
  const params = {
    Destination: {
      ToAddresses: ["marcellog.c@hotmail.com"], // Replace with the email address of the recipient
    },
    Content: {
      Simple: {
        Body: {
          Text: {
            Data: "Hello from Amazon SES!", // Replace with the email body
          },
        },
        Subject: {
          Data: "Test email from Amazon SES", // Replace with the email subject
        },
      },
    },
    FromEmailAddress: "senhas@cbmtb.com", // Replace with the email address of the sender
  };

  const emailSent = sesV2
    .sendEmail(params)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  return emailSent;
}

module.exports = { listVerifiedEmails, sendEmail };
