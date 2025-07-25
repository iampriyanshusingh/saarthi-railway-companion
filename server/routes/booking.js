const express = require("express");
const router = express.Router();
const CloakroomBooking = require("../models/CloakroomBooking");
const CoolieBooking = require("../models/CoolieBooking");
const WheelchairBooking = require("../models/WheelchairBooking");

// POST /api/bookCloakroom
router.post("/bookCloakroom", async (req, res) => {
  try {
    const { station, items, startDate, endDate, price } = req.body;
    if (!station || !items || !startDate || !endDate || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const booking = new CloakroomBooking({
      station,
      items,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price,
    });
    await booking.save();
    res.status(201).json({
      success: true,
      message: "Cloakroom booking successful",
      booking,
    });
  } catch (error) {
    console.error("Cloakroom booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during cloakroom booking",
      error: error.stack,
    });
  }
});

// POST /api/bookCoolie
router.post("/bookCoolie", async (req, res) => {
  try {
    const {
      station,
      pickupLocation,
      departureLocation,
      bookingDate,
      bookingTime,
      price,
    } = req.body;
    if (
      !station ||
      !pickupLocation ||
      !departureLocation ||
      !bookingDate ||
      !bookingTime ||
      !price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const booking = new CoolieBooking({
      station,
      pickupLocation,
      departureLocation,
      bookingDate: new Date(bookingDate),
      bookingTime,
      price,
    });
    await booking.save();
    res
      .status(201)
      .json({ success: true, message: "Coolie booking successful", booking });
  } catch (error) {
    console.error("Coolie booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during coolie booking",
      error: error.stack,
    });
  }
});

// POST /api/bookWheelchair
router.post("/bookWheelchair", async (req, res) => {
  try {
    const { station, bookingDate, bookingTime, price } = req.body;
    if (!station || !bookingDate || !bookingTime || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const booking = new WheelchairBooking({
      station,
      bookingDate: new Date(bookingDate),
      bookingTime,
      price,
    });
    await booking.save();
    res.status(201).json({
      success: true,
      message: "Wheelchair booking successful",
      booking,
    });
  } catch (error) {
    console.error("Wheelchair booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during wheelchair booking",
      error: error.stack,
    });
  }
});

module.exports = router;
