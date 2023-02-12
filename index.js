console.clear();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/categories", require("./routes/categories"));
app.use("/api/events", require("./routes/events"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/users", require("./routes/users"));

app.listen(port, () => {
  console.log(
    `\n----------------------------------------------------------------\nServer running on port ${port}...\n----------------------------------------------------------------\n`
  );
});
