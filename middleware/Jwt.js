const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  next();
};

module.exports = verifyJWT;
