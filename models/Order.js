const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
//   turfId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "turf",
//     require: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//     require: true,
//   },
razorpay_order_id:{
    type:String
}
});

module.exports = mongoose.model("Order",orderSchema)
