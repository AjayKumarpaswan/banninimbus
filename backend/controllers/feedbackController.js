// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";
import Booking from "../models/Booking.js";

export const submitFeedback = async (req, res) => {
  try {
    const { booking_id, guest_id, rating, comments } = req.body;
    if (!booking_id || !guest_id || !rating) return res.status(400).json({ message: "Missing fields" });

    // optional: check booking exists & belongs to guest
    const booking = await Booking.findById(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const fb = new Feedback({ booking_id, guest_id, rating, comments });
    await fb.save();

    res.status(201).json({ message: "Thanks for feedback", feedback: fb });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
