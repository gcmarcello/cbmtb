const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId, userName, userRole, userGivenName) {
  const payload = {
    userId: userId,
    userName: userName,
    userRole: userRole,
    userGivenName: userGivenName,
  };

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3hr" });
}

module.exports = jwtGenerator;
