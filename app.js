const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

require("dotenv").config();

const app = express();

app.use(credentials);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions, { Credentials: true }));
app.use(morgan("dev"));
app.disable("x-powered-by"); //less hackers know about our stack

const userRout = require("./router/user");
const TurfAdminRout = require("./router/turfAdmin");
const adminRout = require("./router/admin");

app.use("/api", userRout);
app.use("/api/turfAdmin", TurfAdminRout);
app.use("/api/admin", adminRout);

const connect = require("./database/connect.js");

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected");
    app.listen(process.env.PORT, () => {
      console.log("listening");
    });
  })
  .catch((err) => {
    console.log(err);
  });
