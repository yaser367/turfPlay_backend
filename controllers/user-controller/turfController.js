const Turf = require("../../models/Turf");

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({isListed:true,isAdminApproved:true,isAdminRejected:false});
    res.status(200).send(turfs);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getoneTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const turf = await Turf.findOne({ _id: id });
    res.status(200).send(turf);
  } catch (error) {
    res.status(500).send(error);
  }
};

const filterData = async (req, res) => {
  try {
    const { game } = req.params;
    if (game === "cricket") {
      const turfs = await Turf.find({isListed:true,isAdminApproved:true,isAdminRejected:false, cricket: { $nin: ["", "0"] } });
      return res.status(200).send({ turfs });
    } else if (game === "tennis") {
      const turfs = await Turf.find({isListed:true,isAdminApproved:true,isAdminRejected:false, tennis: { $nin: ["", "0"] } });
      return res.status(200).send({ turfs });
    } else if (game === "other") {
      const turfs = await Turf.find({isListed:true,isAdminApproved:true,isAdminRejected:false, otherCount: { $nin: ["", "0"] } });
      res.status(200).send({ turfs });
    } else if (game === "football") {
      const turfs = await Turf.find({isListed:true,isAdminApproved:true,isAdminRejected:false,
        $or: [
          {
            $and: [
              { fives: { $nin: ["", "0"] } },
              { sevens: { $nin: ["", "0"] } },
            ],
          },
          {
            $and: [
              { fives: { $nin: ["", "0"] } },
              { elevens: { $nin: ["", "0"] } },
            ],
          },
          {
            $and: [
              { sevens: { $nin: ["", "0"] } },
              { elevens: { $nin: ["", "0"] } },
            ],
          },
          { fives: { $nin: ["", 0] } },
          { sevens: { $nin: ["", 0] } },
          { elevens: { $nin: ["", 0] } },
        ],
      });
      console.log(turfs);
      res.status(200).send({ turfs });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllTurfs,
  getoneTurf,
  filterData,
};
