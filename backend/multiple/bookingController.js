import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    const data = req.body;
    console.log("Incoming booking payload:", data);

    if (!data.rooms || !data.rooms.length) {
      return res.status(400).json({ message: "No rooms selected" });
    }

    // ✅ Duplicate check using paymentId
    if (data.paymentId) {
      const existingBooking = await Booking.findOne({ paymentId: data.paymentId });
      if (existingBooking) {
        return res.status(200).json({
          message: "Booking already exists",
          booking: existingBooking
        });
      }
    }

    // Convert roomId strings to ObjectId
    const roomsWithObjectId = data.rooms.map((r) => ({
      ...r,
      roomId: new mongoose.Types.ObjectId(r.roomId),
      price: Number(r.price) || 0,
      extraChildCharge: Number(r.extraChildCharge) || 0,
    }));

    // Insert booking
    const newBooking = await Booking.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || "",
      checkin: data.checkin,
      checkout: data.checkout,
      nights: data.nights,
      paymentId: data.paymentId,
      totalAmount: data.totalAmount,
      specialRequest: data.specialRequest || "",
      status: data.status || "confirmed",
      rooms: roomsWithObjectId,
    });

    // Mark each room unavailable
    for (const room of roomsWithObjectId) {
      await Room.findByIdAndUpdate(room.roomId, { status: "unavailable" });
    }

    return res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while creating booking", error: err.message });
  }
};


// ✅ Get all bookings (for admin dashboard)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};

// ✅ Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching booking" });
  }
};


// ✅ DELETE a booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting booking" });
  }
};