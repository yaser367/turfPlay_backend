const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const admin = await Admin.find({});
    if (admin.length == 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      const newAdmin = new Admin({
        userName:process.env.ADMIN_USERNAME,
        password: hashedPassword,
      });
      await newAdmin.save();
    }

    const { userName, password } = req.body;
    console.log(userName,password)
    const existAdmin = await Admin.findOne({ userName });
    if (!existAdmin) {
      return res.status(400).send({ error: "Not found" });
    } else {
      const isMatch = await bcrypt.compare(password, existAdmin.password);
      if (!isMatch) {
        return res.status(400).send({ error: "Password not match" });
      } else {
        const token = jwt.sign(
          {
            id: existAdmin._id,
            name: existAdmin.userName,
            type: "admin",
          },
          process.env.JWT_ADMIN_SECRET
        );
        return res.status(200).send({token})
      }
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = {
    login
}
