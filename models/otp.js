const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
 
  }
});

module.exports = mongoose.model("UserOTP", otpSchema);