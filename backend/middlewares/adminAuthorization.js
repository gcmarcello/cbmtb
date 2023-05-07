const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminAuthorization = (roleArray) => async (req, res, next) => {
  const roles = roleArray || ["admin"];

  try {
    const jwtToken = req.header("token");

    if (roles.indexOf(jwt.verify(jwtToken, `${process.env.JWT_KEY}`).userRole) < 0) {
      return res.status(403).json({ message: "Você não está autorizado a fazer isto.", type: "error" });
    }

    const payload = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);

    req.userId = payload.userId;
    req.userName = payload.userName;
    req.userRole = payload.userRole;
  } catch (err) {
    console.log(err.message);
    return res.status(403).json({ message: "Você não está autorizado a fazer isto.", type: "error" });
  }
  next();
};

module.exports = adminAuthorization;
