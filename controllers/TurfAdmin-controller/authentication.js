const TurfAdmin = require("../../models/TurfAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  // console.log("first")

  try {
    const cookies = req.cookies;

    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required." });
    const admin = await TurfAdmin.findOne({ email: email,otpverified:true }).exec();

    if (!admin) return res.sendStatus(401);
    //   if (admin.isVerified === false) return res.sendStatus(402);
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            user: admin._id,
          },
        },
        process.env.JWT_SECRET2,
        { expiresIn: "1000s" }
      );

      const newRefreshToken = jwt.sign(
        {
          user: admin._id,
        },
        process.env.JWT_SECRET2,
        { expiresIn: "1000s" }
      );

      // Changed to let keyword
      let newRefreshTokenArray = !cookies?.jwt
        ? admin.refreshToken
        : admin.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await TurfAdmin.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      admin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await admin.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, admin });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    return console.log(error);
  }
};

module.exports = { handleLogin };
