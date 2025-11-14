import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBooking,
} from "../controllers/AdminBookingController.js";

const router = express.Router();

router.post("/", createBooking); // POST /api/bookings
router.get("/", getAllBookings); // GET /api/bookings
router.get("/:id", getBookingById); // GET /api/bookings/:id
router.delete("/:id", deleteBooking); // DELETE /api/bookings/:id

export default router;
