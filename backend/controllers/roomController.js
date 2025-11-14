import fs from "fs";
import path from "path";
import Room from "../models/Room.js";

/**
 * Create Room (with or without images)
 * POST /api/rooms
 */
export const createRoom = async (req, res) => {
  try {
    const {
      title,
      rating,
      price,
      description,
      includes,
      policy,
      features,
      status,
    } = req.body;

    // If images uploaded
    const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const room = new Room({
      title,
      rating,
      price,
      description,
      includes: includes ? JSON.parse(includes) : [],
      policy: policy ? JSON.parse(policy) : [],
      features: features ? JSON.parse(features) : [],
      images: imagePaths,
      status: status || "available",
    });

    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(); // fetch all rooms regardless of status
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get Available Rooms (for frontend)
 * GET /api/rooms
 */
export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" });
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get Room by ID
 */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update Room
 */
export const updateRoom = async (req, res) => {
  try {
    console.log("🧾 Received Body:", req.body);
    console.log("🖼 Received Files:", req.files);

    const {
      title,
      price,
      description,
      includes,
      policy,
      features,
      status,
      oldImages,
      removeImages, // array of image URLs to delete
    } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // ✅ Parse arrays if sent as strings
    const updateData = {
      title,
      price,
      description,
      includes: includes ? JSON.parse(includes) : [],
      policy: policy ? JSON.parse(policy) : [],
      features: features ? JSON.parse(features) : [],
      status,
    };

    // ✅ Handle image removal
    let updatedImages = room.images || [];
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      updatedImages = updatedImages.filter((img) => !toRemove.includes(img));

      // Delete from uploads folder
      toRemove.forEach((imgPath) => {
        const filePath = path.join("uploads", path.basename(imgPath));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    // ✅ Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    updateData.images = updatedImages;

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({
      message: "✅ Room updated successfully",
      room: updatedRoom,
    });
  } catch (err) {
    console.error("❌ Error updating room:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * Update Room Status (available/unavailable)
 * PUT /api/rooms/:id/status
 */
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "unavailable"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const room = await Room.findByIdAndUpdate(id, { status }, { new: true });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({
      message: `Room status updated to "${status}" successfully`,
      room,
    });
  } catch (err) {
    console.error("Error updating room status:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Delete images
    room.images.forEach((imgPath) => {
      const filePath = path.join("uploads", path.basename(imgPath));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: "Room deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ message: "Server error" });
  }
};