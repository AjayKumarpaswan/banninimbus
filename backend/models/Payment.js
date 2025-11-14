import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    razorpay_order_id: String,
    amount: Number,
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    type: { type: String, enum: ["advance", "balance"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
