const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turf",
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  
  },
  username:{
    type:String
  },
  razorpay_order_id: {
    type: String,
  },
  payement: {
    type: Boolean,
    default: false,
  },
  game: {
    type: String,
  },
  slot: {
    type: String,
  },
  date:{
    type:String
  },
  amount:{
    type:String
  },
  
});

module.exports = mongoose.model("Order", orderSchema);
