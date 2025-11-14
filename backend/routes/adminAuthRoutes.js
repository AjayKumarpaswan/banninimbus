import express from "express";
import upload from "../middleware/upload.js";
import {
  registerAdmin,
  loginAdmin,
  deleteAdmin,
  googleLoginAdmin,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// 🟢 Register Admin (with avatar upload)
router.post("/register", upload.single("avatar"), registerAdmin);

// 🟢 Login Admin (email + password)
router.post("/login", loginAdmin);

// 🟢 Google Login for Admin
router.post("/google", googleLoginAdmin);

// 🟢 Delete Admin by ID
router.delete("/delete/:id", deleteAdmin);

export default router;
