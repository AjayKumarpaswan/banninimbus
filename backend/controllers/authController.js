// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ REGISTER USER WITH AVATAR
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    // ✅ If multer handled file upload, get image path
    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : "";

    // Optional: check for existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // ✅ Create user
    const user = new User({
      name,
      email,
      phone,
      role: role || "guest",
      password_hash: password,
      avatar, // 🟢 store image path
    });

    await user.save();
    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar, // 🟢 return avatar URL
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar, // 🟢 send back avatar on login too
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // token from frontend Google Login

    if (!token) return res.status(400).json({ message: "Token is required" });

    // ✅ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // ✅ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await User.create({
        name: name || "No Name",        // use Google name
        email,
        phone: "",                      // empty phone by default
        role: "guest",                  // default role
        password_hash: googleId,        // store Google ID as password_hash
        avatar: avatar || "",           // Google avatar or empty string
      });
    }

    // ✅ Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",      // include phone
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
