const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (jwt.verify(jwtToken, `${process.env.JWT_KEY}`).userRole !== "admin") {
      return res.status(403).json({ message: "Você não está autorizado a fazer isto.", type: "error" });
    }

    const payload = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);

    req.userId = payload.userId;
    req.userName = payload.userName;
    req.userRole = payload.userRole;
  } catch (err) {
    /* console.log(err.message); */
    return res.json({ message: "Você não está autorizado a fazer isto.", type: "error" });
  }
  next();
};
