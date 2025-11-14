// controllers/paymentController.js
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import { markPaid } from "./bookingController.js";
import crypto from "crypto";

/**
 * Create Razorpay order for 50% advance or balance
 * Body: { bookingId, type } type: 'advance' | 'balance'
 */
export const createOrder = async (req, res) => {
  try {
    const { bookingId, type } = req.body;
    if (!bookingId || !type) return res.status(400).json({ message: "Missing fields" });

    const booking = await Booking.findById(bookingId).populate("room_id");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const amountTotal = booking.amount_total;
    const amountToCharge = type === "advance" ? Math.round((amountTotal * 50) / 100) : Math.round(amountTotal - booking.amount_paid);
    const amountInPaise = amountToCharge * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking._id}_${type}_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    // save payment record with pending
    const payment = new Payment({
      booking_id: booking._id,
      razorpay_order_id: order.id,
      amount: amountToCharge,
      status: "pending",
      type
    });
    await payment.save();

    res.json({ order, paymentId: payment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Verify webhook / payment signature from frontend.
 * Frontend should send: razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId (our DB)
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !paymentId)
      return res.status(400).json({ message: "Missing fields" });

    // verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "success";
    await payment.save();

    // update booking
    const booking = await markPaid(payment.booking_id, payment.amount, payment.type);

    res.json({ message: "Payment verified", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
