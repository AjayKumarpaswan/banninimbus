// server.js
dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cron from "node-cron";
import Booking from "./models/Booking.js";
import { sendEmail } from "./utils/sendEmail.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import AbookingRoutes from "./routes/AdminBookingRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/abookings", AbookingRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

//for payment 
app.use("/api/payment", paymentRoutes);

//for email
app.use("/api", emailRoutes);

// Health
app.get("/", (req, res) => res.send("Baan Nimbus API"));

// Cron job: runs daily at 08:00 server time to send reminders 2 days before check-in
cron.schedule("0 8 * * *", async () => {
  try {
    const now = new Date();
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const start = new Date(twoDaysLater.setHours(0, 0, 0, 0));
    const end = new Date(twoDaysLater.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      checkin: { $gte: start, $lte: end },
      payment_status: { $ne: "paid" }
    }).populate("guest_id");

    for (const b of bookings) {
      const guest = b.guest_id;
      if (!guest || !guest.email) continue;
      await sendEmail(
        guest.email,
        "Reminder: remaining payment due",
        `Dear ${guest.name}, your remaining payment for booking ${b._id} is due before check-in.`,
        `<p>Please complete remaining payment for booking <strong>${b._id}</strong>.</p>`
      );
    }
    console.log(`Cron: reminders sent to ${bookings.length} bookings`);
  } catch (err) {
    console.error("Cron error:", err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
