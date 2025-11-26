import express from "express";
import { createBooking, getBookings, getBookingById, deleteBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Create new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get booking by ID
router.get("/:id", getBookingById);

//to delete the booking by id
router.delete("/:id", deleteBooking);

export default router;
