import express from "express";

import {
  signup,
  login,
  getProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Route
router.get("/me", protect, getProfile);

export default router;