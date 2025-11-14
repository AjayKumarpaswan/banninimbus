import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
    
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: "", // Optional profile image
    },
  },
  { timestamps: true }
);

// 🔐 Password comparison method
adminSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

// 🧂 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// 🟢 Use "admin" as collection name explicitly
export default mongoose.model("Admin", adminSchema);
