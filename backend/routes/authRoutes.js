// routes/authRoutes.js
import express from "express";
import { login, register,deleteUser, googleLogin } from "../controllers/authController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/google", googleLogin);

router.delete("/delete/:id", deleteUser); 

export default router;
