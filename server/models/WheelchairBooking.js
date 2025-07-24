const mongoose = require("mongoose");

const WheelchairBookingSchema = new mongoose.Schema({
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WheelchairBooking", WheelchairBookingSchema);
