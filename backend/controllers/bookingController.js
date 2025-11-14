import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// ✅ Create a new booking with duplicate check
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    if (!bookingData.selectedRooms || !bookingData.selectedRooms.length) {
      return res.status(400).json({ message: "No rooms selected" });
    }

    // ✅ Duplicate check using paymentId
    if (bookingData.paymentId) {
      const existingBooking = await Booking.findOne({ paymentId: bookingData.paymentId });
      if (existingBooking) {
        return res.status(200).json({
          message: "Booking already exists",
          booking: existingBooking,
        });
      }
    }

    // Insert booking into database
    const newBooking = await Booking.create(bookingData);

    // Mark all selected rooms as unavailable
    const roomUpdates = bookingData.selectedRooms.map((room) =>
      Room.findByIdAndUpdate(room.roomId, { status: "unavailable" })
    );
    await Promise.all(roomUpdates);

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
};

// ✅ Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ✅ Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// ✅ Delete booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting booking" });
  }
};



