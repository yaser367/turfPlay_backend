const mongoose = require("mongoose");

const TurfSchema = mongoose.Schema({
  TurfAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TurfAdmin",
    require: true,
  },
  TurfName: {
    type: String,
    require: [true, "Turf name required"],
  },
  mobile: {
    type: Number,
    require: [true, "Mobile number required"],
  },
  ImageUrl: [
    {
      type: String,
    },
  ],
  fives: {
    type: String,
  },
  sevens: {
    type: String,
  },
  elevens: {
    type: String,
  },
  tennis: {
    type: String,
  },
  cricket: {
    type: String,
  },
  other: {
    type: String,
  },
  otherCount: {
    type: String,
  },
  price: {
    type: Number,
    require: [true, "Price required"],
  },
  Description: {
    type: String,
    require: [true, "Description required"],
  },
  uploadImage: {
    type: Boolean,
    default: false,
  },
  isListed: {
    type: Boolean,
    default: false,
  },
  isAdminApproved: {
    type: Boolean,
    default: false,
  },
  lat: {
    type: Number,
  },
  long: { type: Number },
  DocUrl: [
    {
      type: String,
    },
  ],
  uploadDoc: {
    type: Boolean,
    default: false,
  },
  isAdminRejected:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("Turf", TurfSchema);
