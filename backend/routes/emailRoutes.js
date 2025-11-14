import express from "express";
import { sendBookingEmail } from "../controllers/emailController.js";
import { sendBookingWhatsApp } from "../controllers/sendBookingWhatsApp.js"; // ✅ import your WhatsApp controller

const router = express.Router();

router.post("/send-booking-confirmation", async (req, res) => {
  try {
    // ✅ Send both email and WhatsApp in parallel
    await Promise.all([
      sendBookingEmail(req, res, true), // we pass true to skip res.send inside function
      sendBookingWhatsApp(req, res, true),
    ]);

    res.status(200).json({
      message: "Booking confirmation sent via Email and WhatsApp successfully!",
    });
  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    res
      .status(500)
      .json({ message: "Failed to send booking confirmation", error });
  }
});

export default router;
