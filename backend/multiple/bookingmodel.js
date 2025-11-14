import mongoose from "mongoose";

const roomSubSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  roomName: { type: String, required: true },
  images: { type: [String], default: [] },
  description: { type: String, default: "" },
  includes: { type: [String], default: [] },
  policy: { type: [String], default: [] },
  features: { type: [String], default: [] },
  adults: { type: Number, default: 1 },
  kids: { type: Number, default: 0 },
  kidsAges: { type: [String], default: [] },
  pets: { type: Number, default: 0 },
  price: { type: Number, required: true },
  extraChildCharge: { type: Number, default: 0 },
});

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "-" },
    avatar: { type: String, default: "" },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    nights: { type: Number, default: 1 },
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    specialRequest: { type: String, default: "" },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
    rooms: { type: [roomSubSchema], required: true }, // ✅ multiple rooms
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
