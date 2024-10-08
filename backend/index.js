console.clear();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

// Middlewares

app.use(bodyParser.json({ limit: "15mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/bucket", require("./routes/bucket"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/confirmations", require("./routes/confirmations"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/events", require("./routes/events"));
app.use("/api/forms", require("./routes/forms"));
app.use("/api/federations", require("./routes/federations"));
app.use("/api/news", require("./routes/news"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/users", require("./routes/users"));
app.use("/api/webhooks", require("./routes/webhook"));

/* React Routes */

const clientPath = path.resolve(__dirname, "../client");
const buildPath = path.join(clientPath, "build");

if (process.env.NODE_ENV === "development") {
  app.get(/^\/static\/js\/main\.[a-f0-9]{8}\.js\.map$/, (req, res) => {
    const fileName = req.url.slice(1);
    res.sendFile(path.join(buildPath, fileName));
  });
  app.get(/^\/static\/css\/main\.[a-f0-9]{8}\.css\.map$/, (req, res) => {
    const fileName = req.url.slice(1);
    res.sendFile(path.join(buildPath, fileName));
  });
}

app.get(/^\/static\/js\/main\.[a-f0-9]{8}\.js$/, (req, res) => {
  const fileName = req.url.slice(1);
  res.sendFile(path.join(buildPath, fileName));
});
app.get(/^\/static\/css\/main\.[a-f0-9]{8}\.css$/, (req, res) => {
  const fileName = req.url.slice(1);
  res.sendFile(path.join(buildPath, fileName));
});

app.get("/**", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(
    `\n----------------------------------------------------------------\nServer running on port ${port} - NODE_ENV = ${process.env.NODE_ENV}\n----------------------------------------------------------------\n`
  );
});
