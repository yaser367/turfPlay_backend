const User = require("../../models/User");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const otp = require("../../models/otp");
const Order = require("../../models/Order");

/** middleware for verify user */

const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    //check user exist
    let exist = await User.findOne({ username });
    if (!exist) return res.status(404).send({ error: "cannot find user" });
    next();
  } catch (error) {}
};

/** User Registration api */

const userRegistration = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body.credentials;
    console.log(req.body)
    const sentcode = req.body.sentcode;
    const userExist = await User.findOne({ username });

    const ot = new otp({
      userId: username,
      otp: sentcode,
    });
    ot.save();

    if (userExist) {
      return res.status(400).send({ error: "user already exist" });
    } else {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(400).send({ error: "user already exist" });
      } else {
        const hashedPassword = await bycrypt.hash(password, 12);

        const user = new User({
          username,
          password: hashedPassword,
          profile: profile || "",
          email,
        });
        await user
          .save()
          .then(async (result) => {
            console.log(result)
            res.status(201).send({ message: "user Registred successfully" });
          })
          .catch((error) =>console.log(error)
          //  res.status(500).send({ error })
           );
      
        }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

/** User Login api */

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ error: "user not found" });
    } else {
      const isMatch = await bycrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({ error: "password doesn't match" });
      } else {
        const token = jwt.sign(
          {
            userId: user._id,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res.status(200).send({
          message: "Login Successfull..",
          username: user.username,
          token,
        });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(501).send({ error: "invalid username" });
    } else {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(501).send({ error: "User not found" });
      } else {
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(200).send(rest);
      }
    }
  } catch (error) {
    return res.status(404).send({ error: "connot get user data" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const body = req.body;
    if (userId) {
      const body = req.body;

      const updateU = await User.updateOne({ _id: userId }, body);
      return res.status(201).send({ message: "Record Updated" });
    } else {
      return res.status(401).send({ error: "user not found" });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const generateOtp = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};
const verifyOtp = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password

    res.status(201).send({ message: "verify Successfully" });
  }
  return res.status(400).send({ error: "Invalid Otp" });
};

const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired" });
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session Expired" });

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      const hashedPassword = await bycrypt.hash(password, 10);
      await User.updateOne(
        { username: user.username },
        { password: hashedPassword }
      );
      req.app.locals.resetSession = false;
      return res.status(200).send({ message: "Updated Successfuly" });
    } catch (error) {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
const userOtpverify = async (req, res) => {
  try {
    const { code, userName } = req.body;

    const OTP = await otp.findOne({ userId: userName });

    if (code == OTP.otp) {
      await User.findOneAndUpdate(
        { username: userName },
        { $set: { isverified: true } }
      );
      await otp.deleteMany({ userId: userName });
      return res.status(200).send({ message: "Updated Successfuly" });
    } else {
      return res.status(401).send({ error: "otp not match" });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = {
  userRegistration,
  userLogin,
  getUser,
  updateUser,
  generateOtp,
  verifyOtp,
  verifyUser,
  createResetSession,
  resetPassword,
  userOtpverify,
};
