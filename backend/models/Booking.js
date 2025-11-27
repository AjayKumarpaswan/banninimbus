import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    nights: { type: Number, required: true },
    paymentId: { type: String, required: true },
    specialRequest: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    adults: { type: Number, required: true },
    kids: { type: Number, required: true },
    kidsAges: { type: [String], default: [] },
    pets: { type: Number, default: 0 },
    extraChildCharge: { type: Number, default: 0 },
    roomNames: { type: String, required: true },
    remainingAmount: { type: Number, default: 0 },   // ✅ ADD THIS
    advanceAmount: { type: Number, default: 0 }, 
    selectedRooms: {
      type: [
        {
          roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
          roomName: String,
          price: Number,
          images: [String],
          extraChildCharge: Number,
        },
      ],
      required: true,
    },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
