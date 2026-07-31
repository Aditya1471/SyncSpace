import express from "express";

import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  logout,
  refreshToken,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();



// =================================================
// PUBLIC AUTH ROUTES
// =================================================


// Create Account
// POST /api/auth/signup
router.post(
  "/signup",
  signup
);


// Login User
// POST /api/auth/login
router.post(
  "/login",
  login
);





// =================================================
// PROTECTED AUTH ROUTES
// =================================================


// Get Current User
// GET /api/auth/me
router.get(
  "/me",
  protect,
  getProfile
);



// Update Profile
// PUT /api/auth/profile
router.put(
  "/profile",
  protect,
  updateProfile
);



// Change Password
// PUT /api/auth/change-password
router.put(
  "/change-password",
  protect,
  changePassword
);



// Delete Account
// DELETE /api/auth/account
router.delete(
  "/account",
  protect,
  deleteAccount
);



// Logout
// POST /api/auth/logout
router.post(
  "/logout",
  protect,
  logout
);



// Refresh Token
// POST /api/auth/refresh-token
router.post(
  "/refresh-token",
  protect,
  refreshToken
);



export default router;