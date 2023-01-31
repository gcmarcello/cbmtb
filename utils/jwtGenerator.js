const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId, userName, userRole) {
  const payload = {
    userId: userId,
    userName: userName,
    userRole: userRole,
  };

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3hr" });
}

module.exports = jwtGenerator;
