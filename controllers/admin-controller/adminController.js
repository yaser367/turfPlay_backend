const User = require("../../models/User");
const TurfAdmin = require("../../models/TurfAdmin");
const Turf = require("../../models/Turf");
const Order = require("../../models/Order");

const getUserData = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ users });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const getTurfAdminData = async (req, res) => {
  try {
    const turfAdmin = await TurfAdmin.find();
    return res.status(200).send({ turfAdmin });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const getTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    return res.status(200).send({ turfs });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const activeUser = await User.findOne({ _id: id, isActive: true });
    if (activeUser) {
      await User.findOneAndUpdate({ _id: id }, { $set: { isActive: false } });
      return res.status(200).send("user blocked");
    }
    const blockedUser = await User.findOne({ _id: id, isActive: false });
    if (blockedUser) {
      await User.findOneAndUpdate({ _id: id }, { $set: { isActive: true } });
      return res.status(200).send("activated user");
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const blockTurfAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const activeUser = await TurfAdmin.findOne({ _id: id, isVerified: true });
    if (activeUser) {
      await TurfAdmin.findOneAndUpdate(
        { _id: id },
        { $set: { isVerified: false } }
      );
      await Turf.updateMany({ TurfAdminId: id }, { $set: { isListed: false } });
      return res.status(200).send("user blocked");
    }
    const blockedUser = await TurfAdmin.findOne({ _id: id, isVerified: false });
    if (blockedUser) {
      await TurfAdmin.findOneAndUpdate(
        { _id: id },
        { $set: { isVerified: true } }
      );
      return res.status(200).send("activated user");
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
const getTurfRequest = async (req, res) => {
  try {
    const turfs = await Turf.find({
      isAdminApproved: false,
      isAdminRejected: false,
    }).populate("TurfAdminId");
    return res.status(201).send({ turfs });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.body;
    await Turf.findOneAndUpdate(
      { _id: id },
      { $set: { isAdminApproved: true } }
    );
    return res.status(201).send({ message: "Request accepted" });
  } catch (error) {
    return res.status(401).send(error);
  }
};
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.body;
    await Turf.findByIdAndUpdate(
      { _id: id },
      { $set: { isAdminRejected: true } }
    );
    return res.status(201).send({ message: "Request rejected" });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const order = await Order.find({});
    res.status(200).send({ order });
  } catch (error) {}
};

const totalSale = async (req, res) => {
  try {
    const totalsales = await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
          totalPrice: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          totalPrice: 1,
          _id: 1,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).send({ totalsales });
  } catch (error) {}
};

module.exports = {
  getUserData,
  getTurfAdminData,
  getTurfs,
  blockUser,
  blockTurfAdmin,
  getTurfRequest,
  acceptRequest,
  rejectRequest,
  getAllOrder,
  totalSale,
};
