const mongoose = require("mongoose");

const SlotSchema = mongoose.Schema({
  TurfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turf",
    require: true,
  },
  date: {
    type: Date,
  },
  game: {
    type: String,
  },
  slots: [
    {
      slot: {
        type: String,
      },
      booked: {
        type: Boolean,
        default: false,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = mongoose.model("Slot", SlotSchema);
