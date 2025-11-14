import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
    enum: ["guest", "host", "manager", "owner"],
    default: "guest",
  },
  password_hash: { type: String, required: true },
  avatar: { type: String, default: "" }, // 🟢 Image URL or filename
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

export default mongoose.model("User", userSchema);
