const OtpData = require("../models/otp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSOWRD,
  },
});

const sendOTPVerificationMail = async ({ _id, email }, req, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "verify your email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up </p><p> This code <b> Expires in 2 Minutes</b>.</p>`,
    };
    await OtpData.deleteMany({ userId: _id });
    const hashedOTP = await bcrypt.hash(otp, 12);

    const newOTP = new OtpData({
      userId: _id,
      userEmail: email,
      otp: hashedOTP,
      expiresAt: Date.now() + 120000,
    });
    await newOTP.save();

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = {
  sendOTPVerificationMail,
};
