const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
