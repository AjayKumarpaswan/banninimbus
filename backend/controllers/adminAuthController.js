import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import Admin from "../models/Admin.js"; // ✅ import your Admin model

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔑 Helper to create JWT
const createToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ REGISTER ADMIN (with optional avatar upload)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ If using multer for avatar uploads
    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : "";

   

    const admin = new Admin({
      name,
      email,
      phone,
      role: role || "admin",
      password_hash: password,
      avatar,
    });

    await admin.save();
    const token = createToken(admin);

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        avatar: admin.avatar,
      },
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(admin);

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        avatar: admin.avatar,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE ADMIN (by ID)
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GOOGLE LOGIN for Admin
export const googleLoginAdmin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // ✅ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // ✅ Check if admin already exists
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // 🟢 If not exists, create new admin
      admin = await Admin.create({
        name: name || "No Name",
        email,
        phone: "",
        role: "admin", // default
        password_hash: googleId, // store googleId as hashed password
        avatar: avatar || "",
      });
    }

    const jwtToken = createToken(admin);

    res.status(200).json({
      token: jwtToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (err) {
    console.error("Google Admin login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
