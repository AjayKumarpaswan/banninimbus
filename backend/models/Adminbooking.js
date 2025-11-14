import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    checkin: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
    adults: {
      type: Number,
      required: true,
      default: 1,
    },
    kids: {
      type: Number,
      default: 0,
    },
    pets: {
      type: Number,
      default: 0,
    },
    specialRequest: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "pending"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Adminbooking = mongoose.model("ABooking", bookingSchema);

export default Adminbooking;
