const jwt = require("jsonwebtoken");

/* -------------------- GENERATE TOKEN -------------------- */
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* -------------------- VERIFY TOKEN -------------------- */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
