import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    guest_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    comments: String,
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
