import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  updateRoom,
   updateRoomStatus,
} from "../controllers/roomController.js";
import { upload } from "../middleware/uploadMiddleware.js";


const router = express.Router();

// ✅ Public routes
router.get("/", getAvailableRooms);
// Admin route
router.get("/admin", getAllRooms);
router.get("/:id", getRoomById);
// ✅ New route: update room status
router.put("/:id/status", updateRoomStatus);

router.delete("/:id", deleteRoom);


// ✅ Admin/Host routes
router.post("/", upload.array("images", 10), createRoom);
router.put("/:id", upload.array("images", 10), updateRoom);


export default router;
