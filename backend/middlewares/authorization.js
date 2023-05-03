const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.status(403).json({ message: "Você não está autorizado.", type: "error" });
    }
    const payload = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);

    req.userId = payload.userId;
    req.userRole = payload.userRole;
    req.userName = payload.userName;
  } catch (err) {
    return res.status(403).json({ message: "Você não está autorizado.", type: "error" });
  }
  next();
};
