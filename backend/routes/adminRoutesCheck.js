
import express from "express";
const router = express.Router();

import Admin from "../models/Admincheck.js";

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin in DB
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username" });
    }

    // Compare plain password
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
