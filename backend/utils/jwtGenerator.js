const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId, userRole, userName) {
  const payload = {
    userId: userId,
    userRole: userRole,
    userName: userName,
  };

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3hr" });
}

module.exports = jwtGenerator;
