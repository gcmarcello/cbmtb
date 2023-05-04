const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (jwtToken === "undefined") {
      return next();
    }

    const payload = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);

    req.userId = payload.userId;
    req.userName = payload.userName;
    req.userRole = payload.userRole;
    req.userGivenName = payload.userGivenName;
  } catch (err) {
    console.log(err.message);
  }
  next();
};
