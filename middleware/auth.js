const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  /**retrive the user details from the logged user */
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedToken;

  next();
};

const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

const validateAdminToken = async (req, res, next) => {
  if (req.headers["x-custom-header"]) {
    try {
      const admin = req.headers["x-custom-header"];
      const decode = jwt.verify(
        admin,
        process.env.process.env.JWT_ADMIN_SECRET
      );
      const type = decode.type;
      if (type === "admin") {
        next();
      }
    } catch (error) {
      return res.status(400).send({ error: "authentication failed" });
    }
  } else {
    return res.status(400).send({ error: "authentication failed" });
  }
};

module.exports = {
  isAuth,
  localVariables,
  validateAdminToken,
};
