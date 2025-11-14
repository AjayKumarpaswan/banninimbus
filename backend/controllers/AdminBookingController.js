import ABooking from "../models/Adminbooking.js";

// ✅ CREATE a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = await ABooking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};

// ✅ GET all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await ABooking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

// ✅ GET booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await ABooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching booking" });
  }
};

// ✅ DELETE a booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await ABooking.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "ABooking not found" });
    res.status(200).json({ message: "ABooking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting Abooking" });
  }
};
