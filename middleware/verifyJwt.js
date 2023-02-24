const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "6432scretkey09890", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.id = decoded.UserInfo.id;
    next();
  });
};

module.exports = verifyJWT;