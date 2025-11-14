import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rating: {
      type: String,
      default: "4.9",
    },
    price: {
      type: String, // e.g. "₹5,500/night"
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    includes: {
      type: [String], // Array of strings
      default: [],
    },
    policy: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // Array of image URLs or file paths
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
