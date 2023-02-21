require("dotenv").config();

const allowedOrigins = [process.env.FRONTEND_DOMIN, process.env.BACKEND_DOMIN];

module.exports = allowedOrigins;
