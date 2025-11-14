import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// ✅ Create an order
router.post("/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

   

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await instance.orders.create(options);
    console.log("✅ Order created successfully:", order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Verify payment signature
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
