const Turf = require("../../models/Turf");
const TurfAdmin = require("../../models/TurfAdmin");
const Slots = require("../../models/TimeSlot");
const Order = require("../../models/Order");

const addTurf = async (req, res) => {
  try {
    const {
      TurfName,
      mobile,
      fives,
      sevens,
      elevens,
      cricket,
      tennis,
      other,
      otherCount,
      price,
      Description,
    } = req.body.values;
    const { id } = req.body;
    const user = await TurfAdmin.find({ _id: id });

    if (!user) {
      return res.status(400).send({ error: "User Not Found" });
    } else {
      const turf = new Turf({
        TurfAdminId: id,
        TurfName,
        mobile,
        price,
        Description,
        fives,
        sevens,
        elevens,
        cricket,
        tennis,
        other,
        otherCount,
      });
      await turf
        .save()
        .then(
          (result) =>
            res
              .status(201)
              .send({ message: "Turf Registred successfully", result })
        )
        .catch((error) => res.status(500).send({ error }));
    }
  } catch (error) {
  
    return res.status(401).send(error);
  }
};

const uploadImage = async (req, res) => {
  try {
    const { id, urls } = req.body;

    const turf = await Turf.findOne({ _id: id });
    if (!turf) {
      return res.status(400).send({ error: "Turf Not Found" });
    } else {
      const tur = await Turf.updateOne(
        { _id: id },
        { $set: { ImageUrl: urls, uploadImage: true } }
      );
      res.status(201).send({ message: "Image Uploaded successfully" });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const addImage = async (req, res) => {
  try {
  } catch (error) {}
};

const addLocation = async (req, res) => {
  try {
    const { id, lat, long } = req.body;
    const turf = await Turf.findOne({ _id: id });
    if (!turf) {
      return res.status(400).send({ error: "Turf Not Found" });
    } else {
      const tur = await Turf.updateOne({ _id: id }, { $set: { lat, long } });
      res.status(201).send({ message: "Location added successfully" });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const getAllturf = async (req, res) => {
  try {
    const id = req.headers.id;

    const turfs = await Turf.find({ TurfAdminId: id, uploadImage: true });
    res.status(200).send( {turfs} );
  } catch (error) {
    return res.status(401).send(error);
  }
};

const oneTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const turfs = await Turf.findOne({ _id: id });
    return res.status(200).send(turfs);
  } catch (error) {
    return res.status(401).send(error);
  }
};

const editTurf = async (req, res) => {
  try {
    const {
      TurfName,
      mobile,
      price,
      Description,
      fives,
      sevens,
      elevens,
      cricket,
      tennis,
      other,
    } = req.body.values;

    const { id } = req.body;
    const turf = await Turf.findOne({ _id: id });
    if (!turf) {
      return res.status(400).send({ error: "Turf Not Found" });
    } else {
      await Turf.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            TurfName,
            mobile,
            price,
            Description,
            fives,
            sevens,
            elevens,
            cricket,
            tennis,
            other,
          },
        }
      );
    }
    return res.status(200).send({ message: "Successfully updated" });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const listOrUnlistTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const turf = await Turf.findOne({ _id: id });
    if (turf.isListed == true) {
      await Turf.updateOne({ _id: id }, { $set: { isListed: false } });
      return res.status(200).send({ message: "UnListed" });
    } else {
      await Turf.updateOne({ _id: id }, { $set: { isListed: true } });
      return res.status(200).send({ message: "Listed" });
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const uploadDoc = async (req, res) => {
  try {
    try {
      const { id, urls } = req.body;

      const turf = await Turf.findOne({ _id: id });
      if (!turf) {
        return res.status(400).send({ error: "Turf Not Found" });
      } else {
        const tur = await Turf.updateOne(
          { _id: id },
          { $set: { DocUrl: urls, uploadDoc: true } }
        );
        res.status(201).send({ message: "Document Uploaded successfully" });
      }
    } catch (error) {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

const addSlot = async (req, res) => {
  try {
    const { id, slot, date, play } = req.body;

    const dates = new Date(date);
    const dateString = dates.toLocaleDateString();
    const existSlot = await Slots.findOne({
      TurfId: id,
      date: dateString,
      game: play,
    });

    if (!existSlot) {
      const newSlot = new Slots({
        TurfId: id,
        date: dateString,
        game: play,
        slots: [{ slot }],
      });
      await newSlot.save();
      return res.status(200).send({ message: "saved" });
    } else {
      const s = existSlot.slots;
      let a = false;
      s.map((sl) => {
        if (sl.slot == slot) {
          a = true;
        }
      });

      if (a === true) {
        return res.status(401).send({ error: "slot already exist" });
      } else {
        await Slots.findOneAndUpdate(
          { TurfId: id, date: dateString, game: play },
          { $push: { slots: { slot } } }
        );
        return res.status(200).send({ message: "saved" });
      }
    }
  } catch (error) {
 
    return res.status(401).send(error);
  }
};

const deleteTurfImg = async (req, res) => {
  try {
    const { id, deleteUrl } = req.body;
    await Turf.updateOne({ _id: id }, { $pull: { ImageUrl: deleteUrl } });
    res.status(200).send({ message: "deleted" });
  } catch (error) {
    return res.status(401).send(error);
  }
};

const getTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const turfs = await Turf.findOne({ _id: id });
    res.status(200).send({ turfs });
  } catch (error) {}
};

const getslot = async (req, res) => {
  try {
    const { id, game } = req.headers;
    const { date } = req.params;

    const dates = new Date(date);
    const dateString = dates.toLocaleDateString();

    const slot = await Slots.findOne({ TurfId: id, game, date: dateString });
    res.status(200).send({ slot });
  } catch (error) {
    return res.status(401).send(error);

  }
};

const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
   
    const page = req.headers.page || 0;
    
    const docsPerPage = 6;
    const count = await Order.find({ turfId: id }).count();
    const totalPage = Math.ceil(count / docsPerPage);
    const order = await Order.find({ turfId: id })
      .populate("turfId")
      .skip(page * docsPerPage)
      .limit(docsPerPage)
      .sort({ date: -1 });
    res.status(200).send({ order, totalPage });
  } catch (error) {
    return res.status(401).send(error);

  }
};

const bookSlot = async(req,res) => {
  try {
    const {id,play,date,slot} = req.body;
    const stringDate = new Date(date).toLocaleDateString()
    await Slots.updateOne({TurfId:id ,game:play,date:stringDate,slots:{$elemMatch:{slot}}},{$set:{"slots.$.booked":true}})
    res.status(200).send({message:"booked"});
  } catch (error) {
    return res.status(401).send(error);

  }
};

module.exports = {
  addTurf,
  uploadImage,
  getAllturf,
  oneTurf,
  editTurf,
  listOrUnlistTurf,
  addLocation,
  uploadDoc,
  addSlot,
  deleteTurfImg,
  getTurf,
  getslot,
  getOrders,
  bookSlot,
};
