// routes/notificationRoutes.js
import express from "express";
import { notify } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, notify);

export default router;
