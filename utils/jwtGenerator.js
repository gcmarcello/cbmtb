const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId, userRole, userGivenName) {
  const payload = {
    userId: userId,
    userRole: userRole,
    userGivenName: userGivenName,
  };

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3hr" });
}

module.exports = jwtGenerator;
