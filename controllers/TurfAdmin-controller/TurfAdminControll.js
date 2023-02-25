const TurfAdmin = require("../../models/TurfAdmin");
const bycrypt = require("bcrypt");
const OtpData = require("../../models/otp");
const { sendOTPVerificationMail } = require("../../utils/otpMailer");

/** TurfAdmin Registration */

const register = async (req, res) => {
  try {
    const { AdminName, email, password } = req.body;
    const emailExist = await TurfAdmin.findOne({ email });

    if (emailExist) {
      if (emailExist.otpverified === false) {
        await TurfAdmin.findOneAndDelete({ email });
        await OtpData.deleteMany({ userEmail: email });
      }
    }
    const exist = await TurfAdmin.findOne({ email, otpverified: true });
    if (!exist) {
      const hashedPassword = await bycrypt.hash(password, 12);
      const Admin = new TurfAdmin({
        AdminName,
        email,
        password: hashedPassword,
      });
      Admin.save().then((data) => {
        sendOTPVerificationMail(data, req, res, (data) => {});
        return res.status(200).send({ message: "Registred Successfully" });
      });
    } else {
      return res.status(400).send({ error: "User already Exist" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { otp, email } = req.body;
    const userOTP = await OtpData.findOne({ userEmail: email });

    if (Date.now() < userOTP.expiresAt) {
      const isValid = await bycrypt.compare(otp, userOTP.otp);
      if (isValid) {
        await TurfAdmin.findOneAndUpdate({ email }, { otpverified: true });
        await OtpData.findOneAndDelete({ userEmail: email });
        const user = await TurfAdmin.findOne({ email });
        res.status(200).json({ user });
      } else {
        return res.status(400).send({ error: "Invalid" });
      }
    } else {
      await OtpData.deleteMany({ userEmail: email });
      await TurfAdmin.findOneAndDelete({ email });
      return res.status(400).send({ error: "expired" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await TurfAdmin.findOne({ email });
    const userId = user._id;
    await OtpData.deleteMany({ userEmail: email });
    sendOTPVerificationMail({ _id: userId, email }, req, res);
    return res.status(200).send({ message: "Otp sent to your mail" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await TurfAdmin.findOne({ email });
    if (user) {
      const userId = user._id;
      sendOTPVerificationMail({ _id: userId, email }, req, res);
      return res
        .status(200)
        .send({ message: "Verification mail sent to your mail" });
    } else {
      return res.status(400).send({ error: "Not found" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 12);
    await TurfAdmin.findOneAndUpdate({ email }, { password: hashedPassword });
    return res.status(200).send({ message: "password changed successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { AdminName, email, address, mobile, id, url } = req.body;
    const s = await TurfAdmin.updateOne(
      { _id: id },
      {
        $set: {
          AdminName,
          email,
          address,
          mobile,
          profile: url,
        },
      }
    );
    return res.status(200).send({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).send(error);
  }
};



const getTufAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await TurfAdmin.findOne({ _id: id });
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  register,
  resetPassword,
  forgotPassword,
  verifyOTP,
  resendOtp,
  updateProfile,
  getTufAdmin,
};
