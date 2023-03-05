console.clear();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

// Middlewares

app.use(bodyParser.json({ limit: "15mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(express.json());

// Routes
app.use("/api/categories", require("./routes/categories"));
app.use("/api/confirmations", require("./routes/confirmations"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/events", require("./routes/events"));
app.use("/api/forms", require("./routes/forms"));
app.use("/api/federations", require("./routes/federations"));
app.use("/api/news", require("./routes/news"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/users", require("./routes/users"));

/* React Routes */
// Serve react files
app.use(express.static(path.join(__dirname, "client/build")));
// Home Page
app.use("/*", express.static(path.join(__dirname, "client/build")));

app.listen(port, () => {
  console.log(
    `\n----------------------------------------------------------------\nServer running on port ${port}...\n----------------------------------------------------------------\n`
  );
});
