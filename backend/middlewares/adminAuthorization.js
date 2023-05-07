const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminAuthorization = (roleArray) => async (req, res, next) => {
  const roles = roleArray || ["admin"];

  try {
    const jwtToken = req.header("token");
    const userInfo = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);

    if (userInfo.userRole !== "admin") {
      if (roles.indexOf(userInfo.userRole) === -1) {
        return res.status(403).json({ message: "Você não está autorizado a fazer isto.", type: "error" });
      }
    }

    req.userId = userInfo.userId;
    req.userName = userInfo.userName;
    req.userRole = userInfo.userRole;
  } catch (err) {
    console.log(err.message);
    return res.status(403).json({ message: "Você não está autorizado a fazer isto.", type: "error" });
  }
  next();
};

module.exports = adminAuthorization;
