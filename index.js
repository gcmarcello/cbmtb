console.clear();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/categories", require("./routes/categories"));
app.use("/api/events", require("./routes/events"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/users", require("./routes/users"));

/* React Routes */
// Serve react files
app.use(express.static(path.join(__dirname, "client/build")));
// Home Page
app.use("/", express.static(path.join(__dirname, "client/build")));
// Register
app.use("/evento/*", express.static(path.join(__dirname, "client/build")));
// Dashboard
app.use("/dashboard", express.static(path.join(__dirname, "client/build")));
// Edit Matches
app.use("/cadastro/", express.static(path.join(__dirname, "client/build")));
// View Matches
app.use("/login/", express.static(path.join(__dirname, "client/build")));
// View Matches
app.use("/pagamento", express.static(path.join(__dirname, "client/build")));
// View Groups
app.use("/inscricao/*", express.static(path.join(__dirname, "client/build")));

app.listen(port, () => {
  console.log(
    `\n----------------------------------------------------------------\nServer running on port ${port}...\n----------------------------------------------------------------\n`
  );
});
