import express from "express";
import { createBooking, getBookings, getBookingById } from "../controllers/bookingController.js";

const router = express.Router();

// Create new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get booking by ID
router.get("/:id", getBookingById);

export default router;
